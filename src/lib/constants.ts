import type { DataHeatmap, DataPlot } from './server/services/metrics/data/types';

export const HEADER_HEIGHT = 55;
export const SUB_NAV_HEIGHT = 33;

export const DOMAIN = 'https://memsched.com';

// Plan limits for free tier
export const FREE_PLAN_LIMITS = {
  maxObjectives: 3,
  maxWidgets: 3,
} as const;

export const PLOT_DATA: DataPlot = {
  points: [
    { y: 100 },
    { y: 150 },
    { y: 120 },
    { y: 200 },
    { y: 180 },
    { y: 250 },
    { y: 300 },
    { y: 350 },
    { y: 280 },
    { y: 320 },
    { y: 486 },
    { y: 505 },
    { y: 523 },
    { y: 493 },
    { y: 463 },
    { y: 433 },
    { y: 500 },
    { y: 550 },
    { y: 600 },
    { y: 650 },
  ],
};

export const HEATMAP_DATA: DataHeatmap = {
  rows: 7,
  points: [
    { z: 1 },
    { z: 2 },
    { z: 3 },
    { z: 4 },
    { z: 5 },
    { z: 6 },
    { z: 7 },
    { z: 8 },
    { z: 9 },
    { z: 10 },
    { z: 11 },
    { z: 12 },
    { z: 13 },
    { z: 14 },
    { z: 15 },
    { z: 16 },
    { z: 17 },
    { z: 18 },
    { z: 19 },
    { z: 20 },
    { z: 21 },
    { z: 22 },
    { z: 23 },
    { z: 24 },
    { z: 25 },
    { z: 26 },
    { z: 27 },
    { z: 28 },
  ],
};
