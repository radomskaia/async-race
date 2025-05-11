// Buttons
export const BUTTON_TEXT = {
  TO_GARAGE: "To garage",
  TO_WINNERS: "To winners",
  PREVIOUS: "Previous page",
  NEXT: "Next page",
  FIRST: "First page",
  LAST: "Last page",
  START_RACE: "Start race",
  RESET: "Reset",
  GENERATE_CARS: "Generate cars",
  CREATE: "Create",
  DELETE: "Delete",
  EDIT: "Edit",
  START_ENGINE: " Start engine",
  STOP_ENGINE: "Stop engine",
  CROSS: "cross",
  CONFIRM: "confirm",
  ORDER: "Change sort order",
  THEME: "theme",
} as const;
export const BUTTON_TITLE = {
  VOLUME: "Volume",
  ID: "ID",
  THEME: "Change theme",
} as const;
export const SVG_CONFIG = {
  NAMESPACE_SVG: "http://www.w3.org/2000/svg",
  NAMESPACE_XLINK: "http://www.w3.org/1999/xlink",
  QUALIFIED_NAME: "xlink:href",
  ROLE: "img",
} as const;
const SPRITE_PATH = "./sprite.svg#";
export const ICON_PATH = {
  SOUND: {
    ON: SPRITE_PATH + "sound-on",
    OFF: SPRITE_PATH + "sound-off",
  },
  THEME: {
    ON: SPRITE_PATH + "theme-light",
    OFF: SPRITE_PATH + "theme-dark",
  },
  DELETE: SPRITE_PATH + "delete",
  BACK: SPRITE_PATH + "back",
  START_ENGINE: SPRITE_PATH + "start",
  STOP_ENGINE: SPRITE_PATH + "stop",
  ADD: SPRITE_PATH + "add",
  CAR: SPRITE_PATH + "car2",
  EDIT: SPRITE_PATH + "edit",
  CROSS: SPRITE_PATH + "cross",
  CONFIRM: SPRITE_PATH + "confirm",
  FIRST: SPRITE_PATH + "doubleArrowLeft",
  LAST: SPRITE_PATH + "doubleArrowRight",
  NEXT: SPRITE_PATH + "arrowRight",
  PREVIOUS: SPRITE_PATH + "arrowLeft",
  START_RACE: SPRITE_PATH + "startRace",
  RESET: SPRITE_PATH + "reset",
  GENERATE_CARS: SPRITE_PATH + "wheel",
  ORDER: SPRITE_PATH + "sort",
} as const;
export const BUTTON_TYPES = {
  SUBMIT: "submit",
} as const;
