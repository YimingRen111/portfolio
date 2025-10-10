'use client';

import { useSceneController } from '@/lib/scene-controller';
import type { SceneState, TransitionPhase } from '@/lib/scene-controller';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

const CAMERA_ANCHORS: Record<SceneState, { position: THREE.Vector3; lookAt: THREE.Vector3 }> = {
  home: { position: new THREE.Vector3(0, 0.6, 14), lookAt: new THREE.Vector3(0, 0.2, 0) },
  about: { position: new THREE.Vector3(0, 0.25, 6.2), lookAt: new THREE.Vector3(0, 0.4, 0) },
  projects: { position: new THREE.Vector3(1.15, 0.65, 10.6), lookAt: new THREE.Vector3(0.6, 0, 0) },
  contact: { position: new THREE.Vector3(-0.3, -0.05, 8.8), lookAt: new THREE.Vector3(0, -0.3, 0) },
};

const PALETTES: Record<
  SceneState,
  {
    base: THREE.Color;
    emissive: THREE.Color;
    key: THREE.Color;
    rim: THREE.Color;
    background: THREE.Color;
    transmission: number;
    metalness: number;
    roughness: number;
    fogDensity: number;
  }
> = {
  home: {
    base: new THREE.Color('#5b74ff'),
    emissive: new THREE.Color('#2336ff'),
    key: new THREE.Color('#76f4ff'),
    rim: new THREE.Color('#ff70d7'),
    background: new THREE.Color('#05060f'),
    transmission: 0.52,
    metalness: 0.58,
    roughness: 0.18,
    fogDensity: 0.045,
  },
  about: {
    base: new THREE.Color('#d95aa6'),
    emissive: new THREE.Color('#a51f5d'),
    key: new THREE.Color('#ff9bd1'),
    rim: new THREE.Color('#6b9bff'),
    background: new THREE.Color('#170311'),
    transmission: 0.42,
    metalness: 0.42,
    roughness: 0.28,
    fogDensity: 0.032,
  },
  projects: {
    base: new THREE.Color('#45d3be'),
    emissive: new THREE.Color('#088bb0'),
    key: new THREE.Color('#72ffe6'),
    rim: new THREE.Color('#3b6fff'),
    background: new THREE.Color('#00141b'),
    transmission: 0.48,
    metalness: 0.64,
    roughness: 0.16,
    fogDensity: 0.04,
  },
  contact: {
    base: new THREE.Color('#c9d24d'),
    emissive: new THREE.Color('#b97a2a'),
    key: new THREE.Color('#ffe07d'),
    rim: new THREE.Color('#ff7adf'),
    background: new THREE.Color('#161000'),
    transmission: 0.36,
    metalness: 0.44,
    roughness: 0.24,
    fogDensity: 0.028,
  },
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const InteractiveScene = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number>();
  const { sceneState, metrics, phase } = useSceneController();
  const sceneStateRef = useRef<SceneState>(sceneState);
  const previousSceneRef = useRef<SceneState>(sceneState);
  const metricsRef = useRef(metrics);
  const phaseRef = useRef<TransitionPhase>('idle');

  useEffect(() => {
    sceneStateRef.current = sceneState;
  }, [sceneState]);
  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const initialPalette = PALETTES[sceneStateRef.current];
    scene.fog = new THREE.FogExp2(initialPalette.background.clone(), initialPalette.fogDensity);

    const camera = new THREE.PerspectiveCamera(
      42,
      Math.max(container.clientWidth / Math.max(container.clientHeight, 1), 0.1),
      0.1,
      160,
    );
    camera.position.copy(CAMERA_ANCHORS[sceneStateRef.current].position);

    const pointer = { x: 0, y: 0 };

    const ambient = new THREE.AmbientLight(0x6f88ff, 0.48);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(initialPalette.key.clone(), 0.7);
    keyLight.position.set(5.6, 8.5, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(initialPalette.rim.clone(), 1.8, 32);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const noise = new SimplexNoise();
    const coreGeometry = new THREE.IcosahedronGeometry(2.5, 3);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: initialPalette.base.clone(),
      roughness: initialPalette.roughness,
      metalness: initialPalette.metalness,
      clearcoat: 0.75,
      clearcoatRoughness: 0.18,
      emissive: initialPalette.emissive.clone(),
      emissiveIntensity: 0.36,
      transmission: initialPalette.transmission,
      thickness: 3.1,
      ior: 1.45,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    const corePositionAttribute = coreGeometry.getAttribute('position') as THREE.BufferAttribute;
    const basePositions = Float32Array.from(corePositionAttribute.array as Float32Array);
    const baseNormalsAttr = coreGeometry.getAttribute('normal') as THREE.BufferAttribute;
    const baseNormals = Float32Array.from(baseNormalsAttr.array as Float32Array);
    const vertexCount = corePositionAttribute.count;

    const fragmentTargets = new Float32Array(basePositions.length);
    const latticeTargets = new Float32Array(basePositions.length);
    const planeTargets = new Float32Array(basePositions.length);
    const vertexSeeds = new Float32Array(vertexCount);
    const vertexAngles = new Float32Array(vertexCount);

    for (let i = 0; i < vertexCount; i += 1) {
      const index = i * 3;
      const bx = basePositions[index];
      const by = basePositions[index + 1];
      const bz = basePositions[index + 2];
      const nx = baseNormals[index];
      const ny = baseNormals[index + 1];
      const nz = baseNormals[index + 2];

      const seed = Math.random() * Math.PI * 2;
      vertexSeeds[i] = seed;

      const angle = Math.atan2(bz, bx);
      vertexAngles[i] = angle;

      const explodeRadius = 4.5 + Math.random() * 3.2;
      fragmentTargets[index] = bx + nx * explodeRadius + Math.cos(seed) * 1.35 + Math.sin(by * 2.1) * 0.3;
      fragmentTargets[index + 1] = by + ny * explodeRadius + Math.sin(seed) * 1.35 + Math.cos(angle * 3.4) * 0.25;
      fragmentTargets[index + 2] = bz + nz * explodeRadius + (Math.random() - 0.5) * 2.8 + Math.sin(seed * 1.6) * 0.4;

      // Projects lattice (grid snapping)
      const cell = 0.9;
      const snap = (v: number) => Math.round(v / cell) * cell;
      latticeTargets[index] = snap(bx * 1.25);
      latticeTargets[index + 1] = Math.round(by / 0.85) * 0.85;
      latticeTargets[index + 2] = snap(bz * 1.25);

      // Contact portal plane
      const r = Math.sqrt(bx * bx + bz * bz) + 0.0001;
      const theta2 = Math.atan2(bz, bx);
      const radial = Math.min(3.2, r * 0.82 + Math.sin(theta2 * 6 + seed) * 0.12);
      planeTargets[index] = Math.cos(theta2) * radial;
      planeTargets[index + 1] = Math.sin(seed * 2.2 + by * 0.6) * 0.25;
      planeTargets[index + 2] = 2.2 + Math.sin(seed + by * 0.6) * 0.22;
    }

    // Stars
    const isSmallScreen = Math.min(window.innerWidth, window.innerHeight) < 900;
    const starCount = Math.floor((container.clientWidth > 960 ? 1800 : 1100) * (container.clientHeight / 900 + 0.3) * (isSmallScreen ? 0.75 : 1));
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starColor = new THREE.Color();
    for (let i = 0; i < starCount; i += 1) {
      const index = i * 3;
      const radius = THREE.MathUtils.randFloat(6, 38);
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      starPositions[index] = radius * Math.sin(theta) * Math.cos(phi);
      starPositions[index + 1] = radius * Math.sin(phi);
      starPositions[index + 2] = radius * Math.cos(theta) * Math.cos(phi);
      starColor.setHSL(0.58 + Math.random() * 0.12, 0.8, 0.68 + Math.random() * 0.22);
      starColors[index] = starColor.r;
      starColors[index + 1] = starColor.g;
      starColors[index + 2] = starColor.b;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({ vertexColors: true, size: 0.08, sizeAttenuation: true, transparent: true, opacity: 0.82, depthWrite: false });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Glitch sticks (reduced population)
    const glitchGeometry = new THREE.InstancedBufferGeometry();
    const boxGeometry = new THREE.BoxGeometry(0.06, 0.06, 0.8);
    glitchGeometry.copy(boxGeometry as unknown as THREE.InstancedBufferGeometry);
    boxGeometry.dispose();
    const glitchCount = 50;
    const glitchOffsets = new Float32Array(glitchCount * 3);
    const glitchOrientations = new Float32Array(glitchCount * 3);
    for (let i = 0; i < glitchCount; i += 1) {
      const index = i * 3;
      glitchOffsets[index] = THREE.MathUtils.randFloatSpread(8);
      glitchOffsets[index + 1] = THREE.MathUtils.randFloatSpread(8);
      glitchOffsets[index + 2] = THREE.MathUtils.randFloatSpread(8);
      glitchOrientations[index] = THREE.MathUtils.randFloatSpread(Math.PI);
      glitchOrientations[index + 1] = THREE.MathUtils.randFloatSpread(Math.PI);
      glitchOrientations[index + 2] = THREE.MathUtils.randFloatSpread(Math.PI);
    }
    glitchGeometry.setAttribute('offset', new THREE.InstancedBufferAttribute(glitchOffsets, 3));
    glitchGeometry.setAttribute('orientation', new THREE.InstancedBufferAttribute(glitchOrientations, 3));
    glitchGeometry.instanceCount = glitchCount;
    const glitchMaterial = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uIntensity: { value: 0.52 } },
      vertexShader: `
        attribute vec3 offset; attribute vec3 orientation; uniform float uTime; varying float vAlpha;
        mat3 rotationMatrix(vec3 e){float cx=cos(e.x),cy=cos(e.y),cz=cos(e.z),sx=sin(e.x),sy=sin(e.y),sz=sin(e.z);
          return mat3(cy*cz,-cy*sz,sy,cx*sz+sx*sy*cz,cx*cz-sx*sy*sz,-sx*cy,sx*sz-cx*sy*cz,sx*cz+cx*sy*sz,cx*cy);} 
        void main(){ float t=uTime*0.8+offset.x*0.25; vec3 p=position; p.z += sin(t+offset.y)*0.6; p.xy*=0.6+sin(t*2.0+offset.z)*0.18; 
          vec3 r = rotationMatrix(orientation)*p; vec3 tr = r + offset*0.8; vec4 mv = modelViewMatrix*vec4(tr,1.0); gl_Position = projectionMatrix*mv; 
          vAlpha = clamp(0.05 + sin(t+offset.x)*0.45, 0.08, 0.6); }
      `,
      fragmentShader: `varying float vAlpha; uniform float uIntensity; void main(){ gl_FragColor = vec4(0.3,0.75,1.0, vAlpha*uIntensity); }`,
    });
    const glitchMesh = new THREE.Mesh(glitchGeometry, glitchMaterial);
    scene.add(glitchMesh);

    // Projects grid lines
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x247b6d, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    const gridGroup = new THREE.Group();
    gridGroup.visible = false;
    const addGridLayer = (y: number) => {
      const size = 8;
      const step = 0.9;
      const pts: number[] = [];
      for (let i = -size; i <= size; i += step) {
        pts.push(-size, y, i, size, y, i);
        pts.push(i, y, -size, i, y, size);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
      const lines = new THREE.LineSegments(geo, gridMaterial);
      gridGroup.add(lines);
    };
    [-1.7, -0.85, 0, 0.85, 1.7].forEach(addGridLayer);
    scene.add(gridGroup);

    // Contact portal
    const portalMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 }, uAlpha: { value: 0.0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uAlpha; void main(){ vec2 p=vUv*2.0-1.0; float r=length(p); float wave=sin(12.0*r-uTime*2.2); float glow = smoothstep(1.2,0.2,r)*0.6 + smoothstep(0.6,0.2,abs(wave))*0.4; vec3 col = mix(vec3(0.1,0.2,0.6), vec3(1.0,0.8,0.4), smoothstep(0.0,1.0,r)); gl_FragColor = vec4(col, glow*uAlpha); }`,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const portal = new THREE.Mesh(new THREE.CircleGeometry(3.6, 96), portalMaterial);
    portal.rotation.x = -Math.PI / 2;
    portal.position.set(0, -0.2, 2.2);
    portal.scale.set(0.01, 0.01, 0.01);
    scene.add(portal);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.2));
      renderer.setSize(width, height);
    };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    resize();
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    const targetCameraPosition = CAMERA_ANCHORS[sceneStateRef.current].position.clone();
    const cameraBaseTemp = targetCameraPosition.clone();
    const lookAtTarget = CAMERA_ANCHORS[sceneStateRef.current].lookAt.clone();
    const lookAtTemp = lookAtTarget.clone();
    const baseColorTarget = initialPalette.base.clone();
    const emissiveTarget = initialPalette.emissive.clone();
    const keyLightTarget = initialPalette.key.clone();
    const rimLightTarget = initialPalette.rim.clone();
    const backgroundColor = initialPalette.background.clone();
    const backgroundTarget = initialPalette.background.clone();
    let fogDensityTarget = initialPalette.fogDensity;

    const tmpScaleTarget = new THREE.Vector3();
    let normalFrame = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      if (document.hidden) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      const state = sceneStateRef.current;
      const palette = PALETTES[state];
      const metricsState = metricsRef.current;
      const phaseNow = phaseRef.current;

      if (state !== previousSceneRef.current) {
        baseColorTarget.copy(palette.base);
        emissiveTarget.copy(palette.emissive);
        keyLightTarget.copy(palette.key);
        rimLightTarget.copy(palette.rim);
        backgroundTarget.copy(palette.background);
        fogDensityTarget = palette.fogDensity;
        coreMaterial.transmission = palette.transmission;
        coreMaterial.metalness = palette.metalness;
        coreMaterial.roughness = palette.roughness;
        previousSceneRef.current = state;
      }

      coreMaterial.color.lerp(baseColorTarget, 0.05);
      coreMaterial.emissive.lerp(emissiveTarget, 0.06);
      keyLight.color.lerp(keyLightTarget, 0.08);
      rimLight.color.lerp(rimLightTarget, 0.08);
      const keyIntensityTarget = state === 'projects' ? 0.78 : state === 'contact' ? 0.62 : state === 'about' ? 0.68 : 0.7;
      keyLight.intensity += (keyIntensityTarget - keyLight.intensity) * 0.05;
      const rimIntensityTarget = state === 'about' ? 1.4 : state === 'projects' ? 1.8 : state === 'contact' ? 1.55 : 1.6;
      rimLight.intensity += (rimIntensityTarget - rimLight.intensity) * 0.05;

      backgroundColor.lerp(backgroundTarget, 0.04);
      renderer.setClearColor(backgroundColor, 0.9);
      const fog = scene.fog as THREE.FogExp2;
      fog.color.lerp(backgroundColor, 0.08);
      fog.density += (fogDensityTarget - fog.density) * 0.03;

      // Grid and portal visibility by scene state
      // Only show grid lines on Projects; hide entirely elsewhere
      const isProjects = state === 'projects';
      gridGroup.visible = isProjects;
      gridMaterial.opacity += ((isProjects ? 0.22 : 0.0) - gridMaterial.opacity) * 0.08;
      portalMaterial.uniforms.uAlpha.value = THREE.MathUtils.lerp(
        portalMaterial.uniforms.uAlpha.value as number,
        state === 'contact' ? 0.65 : 0.0,
        0.06,
      );
      if (state === 'contact') tmpScaleTarget.set(1, 1, 1); else tmpScaleTarget.set(0.01, 0.01, 0.01);
      portal.scale.lerp(tmpScaleTarget, 0.08);

      // Camera placement and shake
      cameraBaseTemp.copy(CAMERA_ANCHORS[state].position);
      const influence = state === 'home' ? 1.8 : state === 'about' ? 1.2 : state === 'projects' ? 1.5 : 1.1;
      cameraBaseTemp.x += pointer.x * influence;
      cameraBaseTemp.y += -pointer.y * influence * 0.6;
      cameraBaseTemp.z -= pointer.y * 0.8;
      if (phaseNow === 'pre') {
        const j = 0.04;
        cameraBaseTemp.x += Math.sin(elapsed * 56) * j;
        cameraBaseTemp.y += Math.cos(elapsed * 48) * j * 0.9;
        cameraBaseTemp.z += Math.sin(elapsed * 40) * j * 0.5;
      }
      targetCameraPosition.lerp(cameraBaseTemp, 0.08);
      camera.position.lerp(targetCameraPosition, 0.1);
      lookAtTemp.copy(CAMERA_ANCHORS[state].lookAt);
      lookAtTemp.x += pointer.x * 0.2;
      lookAtTemp.y += -pointer.y * 0.2;
      if (phaseNow === 'pre') {
        const lj = 0.04;
        lookAtTemp.x += Math.sin(elapsed * 36) * lj;
        lookAtTemp.y += Math.cos(elapsed * 32) * lj * 0.8;
      }
      camera.lookAt(lookAtTemp);

      // Vertex animation (no blast branch)
      const positions = corePositionAttribute.array as Float32Array;
      const freq = 0.42;
      const pulse = 0.25 + Math.sin(elapsed * 0.8) * 0.1;
      const flow = Math.sin(elapsed * 0.35) * 0.5;
      for (let i = 0; i < vertexCount; i += 1) {
        const index = i * 3;
        const bx = basePositions[index];
        const by = basePositions[index + 1];
        const bz = basePositions[index + 2];
        const currentX = positions[index];
        const currentY = positions[index + 1];
        const currentZ = positions[index + 2];
        let targetX = currentX;
        let targetY = currentY;
        let targetZ = currentZ;

        if (state === 'home') {
          const noiseSample = noise.noise4d(bx * freq, by * freq, bz * freq, elapsed * 0.55);
          const secondary = noise.noise4d((bx + 12) * (freq * 0.7), (by - 18) * (freq * 0.7), (bz + 6) * (freq * 0.7), elapsed * 0.92);
          const displacement = 1 + noiseSample * (0.38 + pulse) + secondary * 0.22;
          const swirl = flow * 0.18;
          targetX = bx * displacement + (-by * swirl + noiseSample * 0.22);
          targetY = by * displacement + (bx * swirl + secondary * 0.2);
          targetZ = bz * displacement + (noiseSample - secondary) * 0.16;
          const mag = Math.sqrt(targetX * targetX + targetY * targetY + targetZ * targetZ);
          if (mag > 3.6) {
            const clampFactor = 3.6 / mag;
            targetX *= clampFactor; targetY *= clampFactor; targetZ *= clampFactor;
          }
        } else if (state === 'about') {
          const fx = fragmentTargets[index];
          const fy = fragmentTargets[index + 1];
          const fz = fragmentTargets[index + 2];
          const nx = baseNormals[index];
          const ny = baseNormals[index + 1];
          const nz = baseNormals[index + 2];
          const seed = vertexSeeds[i];
          const drift = Math.sin(elapsed * 0.8 + seed) * 0.65;
          targetX = fx + nx * 0.6 * drift; targetY = fy + ny * 0.6 * drift; targetZ = fz + nz * 0.6 * drift;
        } else if (state === 'projects') {
          const lx = latticeTargets[index];
          const ly = latticeTargets[index + 1];
          const lz = latticeTargets[index + 2];
          const seed = vertexSeeds[i];
          targetX = lx + Math.sin(elapsed * 1.1 + seed) * 0.32;
          targetY = ly + Math.sin(elapsed * 1.6 + vertexAngles[i] * 2.4) * 0.7;
          targetZ = lz + Math.cos(elapsed * 1.05 + seed) * 0.32;
        } else {
          const px = planeTargets[index];
          const py = planeTargets[index + 1];
          const pz = planeTargets[index + 2];
          const seed = vertexSeeds[i];
          const ripple = Math.sin(elapsed * 1.2 + seed) * 0.35;
          targetX = px + Math.cos(elapsed * 0.7 + seed) * 0.28;
          targetY = py + ripple;
          targetZ = pz + Math.sin(elapsed * 0.9 + seed) * 0.24;
        }

        const ease = state === 'home' ? 0.09 : state === 'about' ? 0.065 : state === 'projects' ? 0.06 : 0.06;
        positions[index] += (targetX - currentX) * ease;
        positions[index + 1] += (targetY - currentY) * ease;
        positions[index + 2] += (targetZ - currentZ) * ease;
      }

      corePositionAttribute.needsUpdate = true;
      if ((normalFrame++ & 1) === 0) coreGeometry.computeVertexNormals();
      const emiBase = state === 'home' ? 0.32 : 0.22;
      const emiAmp = state === 'home' ? 0.07 : 0.05;
      coreMaterial.emissiveIntensity = emiBase + Math.sin(elapsed * 0.6) * emiAmp;

      const projectFactor = clamp01(metricsState.projectCount / 8);
      const collaboration = clamp01(metricsState.collaborationFactor);
      const outreach = clamp01(metricsState.outreachLevel);
      starMaterial.size = THREE.MathUtils.lerp(starMaterial.size, 0.07 + projectFactor * 0.045, 0.08);
      starMaterial.opacity = THREE.MathUtils.lerp(starMaterial.opacity, 0.55 + outreach * 0.4, 0.08);
      glitchMaterial.uniforms.uIntensity.value = THREE.MathUtils.lerp(
        glitchMaterial.uniforms.uIntensity.value as number,
        0.28 + collaboration * 0.9 + (phaseNow === 'pre' ? 0.2 : 0.0),
        0.12,
      );

      // Drive glitch sticks animation
      glitchMaterial.uniforms.uTime.value = elapsed;

      portalMaterial.uniforms.uTime.value = elapsed;
      stars.rotation.y += 0.00045;
      stars.rotation.x += 0.0003;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', resize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      gridGroup.traverse((obj) => {
        const anyObj = obj as any;
        if (anyObj.geometry) anyObj.geometry.dispose();
      });
      gridMaterial.dispose();
      portal.geometry.dispose();
      portalMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      glitchGeometry.dispose();
      glitchMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 -z-10" />;
};

export default InteractiveScene;
