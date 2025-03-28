// Buttons
export const BUTTON_TEXT = {
  GARAGE: "To garage",
  WINNERS: "To winners",
  PREVIOUS_PAGE: "Prev",
  NEXT_PAGE: "Next",
  START_RACE: "Start race",
  RESET: "Reset",
  GENERATE_CARS: "Generate cars",
  CREATE: "Create",
  DELETE: "Delete",
  EDIT: "Edit",
  START_ENGINE: " Start engine",
  STOP_ENGINE: "Stop engine",
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
  PASTE: SPRITE_PATH + "paste",
  CLEAR: SPRITE_PATH + "clear",
  PLAY: SPRITE_PATH + "play",
  ADD: SPRITE_PATH + "add",
  CAR: SPRITE_PATH + "car",
} as const;
export const ATTRIBUTES = {
  ariaLabel: "aria-label",
} as const;
export const BUTTON_TYPES = {
  BUTTON: "button",
} as const;
