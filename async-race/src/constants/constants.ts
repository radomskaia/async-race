export const APP_NAME = "Async Race";

export const LS_PREFIX = "radomskaia--async-race--";

// Common constants
export const HALF = 0.5;
export const ZERO = 0;
export const ONE = 1;
export const DOUBLE = 2;
export const EMPTY_STRING = "";
export const FIRST_INDEX = 0;
export const NOT_FOUND_INDEX = -1;
export const LAST_INDEX = -1;
export const REMOVE_ONE_ITEM = 1;

export const SYMBOLS = {
  // line: "\n",
  // comma: ",",
  // dash: "-",
  hash: "#",
};

export const PAGE_PATH = {
  HOME: "/",
  DECISION_PICKER: "/winners",
  NOT_FOUND: "404",
} as const;
// Messages
export const MESSAGES = {
  ROUTE_NOT_FOUND: "Route not found",
  NOT_INITIALIZED: "Class is not initialized",
  PAGE_NOT_FOUND: "Sorry, page not found",
  INIT_WHEEL_TEXT: "Please, press the button to start the wheel",
  VALIDATION: `Please add at least 2 valid options.\n\nAn option is considered valid if its title is not empty and its weight is greater than 0`,
} as const;

export const DELAY_TIME = 300;

export const API_URLS = {
  WINNERS: "/winners",
  GARAGE: "/garage",
  ENGINE: "/engine",
};
