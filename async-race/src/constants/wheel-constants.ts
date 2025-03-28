import { DOUBLE } from "@/constants/constants.ts";

export const CANVAS_SIZE = 512;
const CIRCLE_PADDING = 25;
const CENTER = CANVAS_SIZE / DOUBLE;
export const MILLISECONDS_IN_SECOND = 1000;
export const MAX_PERCENTAGE = 100;

export const COLOR = {
  RGB_MAX: 255,
  OPACITY: 0.8,
  TYPE: "rgb",
};

export const DEFAULT_SETTINGS = {
  DURATION: 5,
  TURNS_COUNT: 5,
};

export const CIRCLE = {
  CENTER: {
    X: CENTER,
    Y: CENTER + CIRCLE_PADDING / DOUBLE,
  },
  RADIUS: {
    BIG: CENTER - CIRCLE_PADDING,
    SMALL: 20,
  },
  INITIAL_DEGREE: -90,
  HALF_DEGREE: 180,
  START_ANGLE: 0,
  FULL_RADIAN: Math.PI * DOUBLE,
} as const;

export const TEXT = {
  OFFSET: 0.55,
  FONT: {
    SIZE: "16px",
    FAMILY: "inter",
  },
  ALIGN: "center",
  BASELINE: "middle",
  MAX_WIDTH: 100,
  MIN_ANGLE: 0.18,
  ELLIPSIS: "...",
} as const;

export const CURSOR = {
  ANGLE: {
    MIN: 20,
    MAX: 60,
  },
  Y: {
    TOP: 50,
    BOTTOM: 10,
    MIDDLE: 20,
  },
  WIDTH: 35,
} as const;
