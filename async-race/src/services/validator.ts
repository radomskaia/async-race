import {
  CAR_KEYS,
  RACE_KEYS,
  RESPONSE_DATA_KEYS,
  WINNER_KEYS,
  ZERO,
} from "@/constants/constants.ts";
import type {
  Car,
  RaceData,
  ResponseCarData,
  ResponseData,
  WinnerData,
} from "@/types";

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isResponseData(value: unknown): value is ResponseData {
  if (!isObject(value)) {
    return false;
  }
  return RESPONSE_DATA_KEYS.DATA in value && RESPONSE_DATA_KEYS.COUNT in value;
}

export function isResponseCarData(value: unknown): value is ResponseCarData {
  if (!isResponseData(value)) {
    return false;
  }
  return isCarArray(value.data);
}

export function isRaceData(value: unknown): value is RaceData {
  if (!isObject(value)) {
    return false;
  }
  if (!(RACE_KEYS.DISTANCE in value && RACE_KEYS.VELOCITY in value)) {
    return false;
  }
  return isPositiveNumber(value.distance) && isPositiveNumber(value.velocity);
}

export function isPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value >= ZERO;
}

export function isCarArray(value: unknown): value is Car[] {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((car) => isCar(car));
}

export function isWinnerData(value: unknown): value is WinnerData {
  if (!isObject(value)) {
    return false;
  }
  if (
    !(
      WINNER_KEYS.ID in value &&
      WINNER_KEYS.TIME in value &&
      WINNER_KEYS.WINS in value
    )
  ) {
    return false;
  }

  return (
    isPositiveNumber(value.id) &&
    isPositiveNumber(value.time) &&
    isPositiveNumber(value.wins)
  );
}

export function isResponseWinnerData(value: unknown): value is WinnerData {
  if (!isResponseData(value)) {
    return false;
  }
  return isCar(value.data) && isString(value.data.name);
}

function isCar(value: unknown): value is Car {
  if (!isObject(value)) {
    return false;
  }

  if (
    !(CAR_KEYS.NAME in value && CAR_KEYS.COLOR in value && CAR_KEYS.ID in value)
  ) {
    return false;
  }

  return isString(value.name) && isString(value.color) && isNumber(value.id);
}

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}
