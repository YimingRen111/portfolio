'use client';

import InteractiveScene from '@/components/InteractiveScene';
import {
  SceneControllerContext,
  type SceneMetrics,
  type SceneState,
  type TransitionPhase,
} from '@/lib/scene-controller';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type RouteTransitionContextValue = {
  isTransitioning: boolean;
};

const RouteTransitionContext = createContext<RouteTransitionContextValue>({
  isTransitioning: false,
});

export const useRouteTransition = () => useContext(RouteTransitionContext);

const DEFAULT_METRICS: SceneMetrics = {
  projectCount: 6,
  collaborationFactor: 0.6,
  outreachLevel: 0.55,
};

const SCENE_METRIC_PRESETS: Record<SceneState, SceneMetrics> = {
  home: DEFAULT_METRICS,
  about: { projectCount: 4, collaborationFactor: 0.48, outreachLevel: 0.64 },
  projects: { projectCount: 12, collaborationFactor: 0.82, outreachLevel: 0.58 },
  contact: { projectCount: 6, collaborationFactor: 0.55, outreachLevel: 0.9 },
};

const cloneMetrics = (metrics: SceneMetrics): SceneMetrics => ({ ...metrics });

// Visual size hierarchy: higher = visually larger core
const SCENE_RANK: Record<SceneState, number> = {
  home: 4,
  projects: 3,
  contact: 2,
  about: 1,
};

const mapPathToSceneState = (pathname: string | null | undefined): SceneState => {
  if (!pathname) return 'home';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/contact')) return 'contact';
  return 'home';
};

const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const initialScene = useMemo(() => mapPathToSceneState(pathname), [pathname]);
  const [sceneState, setSceneState] = useState<SceneState>(initialScene);
  const [metrics, setMetrics] = useState<SceneMetrics>(
    cloneMetrics(SCENE_METRIC_PRESETS[initialScene] ?? DEFAULT_METRICS),
  );
  const [phase, setPhase] = useState<TransitionPhase>('idle');

  const transitionTimeoutRef = useRef<number>();
  const preTimerRef = useRef<number>();
  const settleTimerRef = useRef<number>();

  useEffect(() => {
    const nextScene = mapPathToSceneState(pathname);
    setSceneState(nextScene);
    setMetrics(cloneMetrics(SCENE_METRIC_PRESETS[nextScene] ?? DEFAULT_METRICS));

    if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => setPhase('idle'), 350);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
      if (preTimerRef.current) window.clearTimeout(preTimerRef.current);
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    };
  }, []);

  const transitionTo = useCallback(
    (nextScene: SceneState, options?: { route?: string; delay?: number }) => {
      const currentRank = SCENE_RANK[sceneState] ?? 0;
      const nextRank = SCENE_RANK[nextScene] ?? 0;
      const shouldExplode = nextRank < currentRank; // only large -> small

      if (!options?.route) return; // require explicit route

      if (!shouldExplode) {
        // Direct navigation, no cinematic
        router.push(options.route);
        return;
      }

      // Cinematic on current page: shake/scale only (no blast)
      setPhase('pre');
      if (preTimerRef.current) window.clearTimeout(preTimerRef.current);
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);

      const routeDelay = Math.max(0, options?.delay ?? 500);
      transitionTimeoutRef.current = window.setTimeout(() => {
        router.push(options.route!);
      }, routeDelay);
    },
    [router, sceneState],
  );

  const updateMetrics = useCallback((partial: Partial<SceneMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...partial }));
  }, []);

  const sceneContextValue = useMemo(
    () => ({ sceneState, metrics, phase, transitionTo, updateMetrics }),
    [metrics, phase, sceneState, transitionTo, updateMetrics],
  );

  return (
    <RouteTransitionContext.Provider value={{ isTransitioning: phase !== 'idle' }}>
      <SceneControllerContext.Provider value={sceneContextValue}>
        <InteractiveScene />
        {children}
      </SceneControllerContext.Provider>
    </RouteTransitionContext.Provider>
  );
};

export default TransitionProvider;
