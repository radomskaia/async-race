import { SYMBOLS } from "@/constants/constants.ts";

export const OptionsConstants = 2;
// ID
export const ID_PREFIX = SYMBOLS.hash;

// Keys
export const OPTION_KEYS = {
  ID: "id",
  TITLE: "title",
  WEIGHT: "weight",
} as const;
export const OPTION_LIST_KEYS = {
  LAST_ID: "lastId",
  LIST: "list",
} as const;

export { ZERO as INITIATION_ID } from "@/constants/constants.ts";
