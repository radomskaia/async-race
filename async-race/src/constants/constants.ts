export const APP_NAME = "Async Race";

export const LS_PREFIX = "radomskaia--async-race--";

// Common constants
export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;
export const EMPTY_STRING = "";
export const CARS_COUNT = 100;
export const MS_IS_SECOND = 1000;
export const SYMBOLS = {
  hash: "#",
};

export const COLOR = {
  RGB: "RGB",
  RANGE: 256,
  HEX_BASE: 16,
  HEX_LENGTH: 2,
  ZERO_PAD: "0",
};

export const PAGE_PATH = {
  HOME: "/",
  WINNERS: "/winners",
  NOT_FOUND: "404",
} as const;

// Messages
export const MESSAGES = {
  ROUTE_NOT_FOUND: "Route not found",
  NOT_INITIALIZED: "Class is not initialized",
  PAGE_NOT_FOUND: "Sorry, page not found",
  INVALID_DATA: "Invalid data",
} as const;

export const DELAY_TIME = 300;

export enum API_URLS {
  WINNERS = "/winners",
  GARAGE = "/garage",
  ENGINE = "/engine",
}

export const CAR_KEYS = {
  NAME: "name",
  COLOR: "color",
  ID: "id",
} as const;

export const RACE_KEYS = {
  VELOCITY: "velocity",
  DISTANCE: "distance",
} as const;

export const RESPONSE_DATA_KEYS = {
  DATA: "data",
  COUNT: "count",
} as const;

export const WINNER_KEYS = {
  ID: "id",
  WINS: "wins",
  TIME: "time",
} as const;

export const ELEMENTS_PER_PAGE = 7;

export const RESPONSE_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const API_URL = "http://192.168.88.124:3000";
export const API_HEADER = {
  "Content-Type": "application/json",
} as const;
export const COUNT_HEADER = "X-Total-Count";

export const NOTIFICATION_TIME = 4000;
