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
  HASH: "#",
  BRACKET: {
    OPEN: "(",
    CLOSE: ")",
  },
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

export const CARS_PER_PAGE = 7;
export const WINNERS_PER_PAGE = 10;

export const API_URL = "http://localhost:3000";
export const API_HEADER = {
  "Content-Type": "application/json",
} as const;
export const COUNT_HEADER = "X-Total-Count";

export const NOTIFICATION_TIME = 4000;

export const ERROR_MESSAGES = {
  PATH_REQUIRED: "Path is required",
  INVALID_DATA: "Invalid data",
  NO_LISTENERS: "No listeners for event type",
  ABORTED: "Aborted",
  RACE_STOPPED: "Race stopped by user",
  FETCH: "Error while fetching data: ",
  SERVICE_NOT_FOUND: "Service not found",
  INVALID_SERVICE: "Invalid service",
  CONTAINER_NOT_FOUND: "Container not found",
} as const;

export const ATTRIBUTES = {
  FILL: "fill",
  ARIA_LABEL: "aria-label",
} as const;

export const WINNER_MESSAGE = "Winner is";
export const TIME_MESSAGE = "with time";

export const PAGE_NAME = {
  GARAGE: "Garage",
  WINNERS: "Winners",
};

export const WINNERS_TABLE_HEADERS = [
  "ID",
  "Car",
  "Name",
  "Wins",
  "Time",
] as const;

export const SUFFIXES = {
  COUNT: "x",
  SECONDS: "s",
};

export const ANIMATE_FILL_MODE = "forwards";
