'use client';

import { createContext, useContext } from 'react';
import type { Route } from 'next';

export type SceneState = 'home' | 'about' | 'projects' | 'contact';

export type SceneMetrics = {
  projectCount: number;
  collaborationFactor: number;
  outreachLevel: number;
};

export type TransitionPhase = 'idle' | 'pre' | 'blast';

export type SceneControllerValue = {
  sceneState: SceneState;
  metrics: SceneMetrics;
  phase: TransitionPhase;
  transitionTo: (
    scene: SceneState,
    options?: {
      route?: Route;
      delay?: number;
    },
  ) => void;
  updateMetrics: (partial: Partial<SceneMetrics>) => void;
};

const DEFAULT_METRICS: SceneMetrics = {
  projectCount: 6,
  collaborationFactor: 0.6,
  outreachLevel: 0.55,
};

export const SceneControllerContext = createContext<SceneControllerValue>({
  sceneState: 'home',
  metrics: DEFAULT_METRICS,
  phase: 'idle',
  transitionTo: () => {},
  updateMetrics: () => {},
});

export const useSceneController = () => useContext(SceneControllerContext);

