'use client';

import InteractiveScene from '@/components/InteractiveScene';
import {
  SceneControllerContext,
  type SceneMetrics,
  type SceneState,
  type TransitionPhase,
} from '@/lib/scene-controller';
import { usePathname, useRouter } from 'next/navigation';
import type { Route } from 'next';
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
  about: {
    projectCount: 8,
    collaborationFactor: 0.74,
    outreachLevel: 0.62,
  },
  projects: {
    projectCount: 12,
    collaborationFactor: 0.82,
    outreachLevel: 0.58,
  },
  contact: {
    projectCount: 6,
    collaborationFactor: 0.6,
    outreachLevel: 0.96,
  },
};

const cloneMetrics = (metrics: SceneMetrics): SceneMetrics => ({ ...metrics });

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
    (nextScene: SceneState, options?: { route?: Route; delay?: number }) => {
      const currentRank = SCENE_RANK[sceneState] ?? 0;
      const nextRank = SCENE_RANK[nextScene] ?? 0;
      const shouldExplode = nextRank < currentRank;

      if (!options?.route) return;

      if (!shouldExplode) {
        router.push(options.route);
        return;
      }

      setPhase('pre');
      if (preTimerRef.current) window.clearTimeout(preTimerRef.current);
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);

      preTimerRef.current = window.setTimeout(() => setPhase('blast'), 800);

      const routeDelay = Math.max(0, options?.delay ?? 700);
      const targetRoute = options.route;
      transitionTimeoutRef.current = window.setTimeout(() => {
        router.push(targetRoute);
      }, routeDelay);
    },
    [router, sceneState],
  );

  const updateMetrics = useCallback((partial: Partial<SceneMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...partial }));
  }, []);

  const sceneContextValue = useMemo(
    () => ({
      sceneState,
      metrics,
      phase,
      transitionTo,
      updateMetrics,
    }),
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
