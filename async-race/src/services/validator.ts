import {
  CAR_KEYS,
  RACE_KEYS,
  RESPONSE_DATA_KEYS,
  WINNER_KEYS,
  ZERO,
} from "@/constants/constants.ts";
import type { Car, CarProperties, ModalData } from "@/types";
import type {
  FullData,
  ResponseCarData,
  ResponseData,
  ResponseWinnerData,
  WinnerData,
} from "@/types/api-service-types.ts";
import { Sort } from "@/types/api-service-types.ts";
import type { RaceData } from "@/types/race-service-types.ts";

export function isResponseCarData(value: unknown): value is ResponseCarData {
  if (!isResponseData(value)) {
    return false;
  }
  return isCarArray(value.data);
}

export function isResponseWinnerData(
  value: unknown,
): value is ResponseWinnerData {
  if (!isResponseData(value)) {
    return false;
  }
  return isWinnerArray(value.data);
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

export function isWinnerArray(value: unknown): value is WinnerData[] {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((winner) => isWinnerData(winner));
}

function checkCarProperties(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }
  if (!(CAR_KEYS.NAME in value && CAR_KEYS.COLOR in value)) {
    return false;
  }

  return isString(value.name) && isString(value.color);
}

export function isCarProperties(value: unknown): value is CarProperties {
  return checkCarProperties(value);
}

export function isCar(value: unknown): value is Car {
  if (!isObject(value)) {
    return false;
  }

  return (
    checkCarProperties(value) &&
    CAR_KEYS.ID in value &&
    isPositiveNumber(value.id)
  );
}

export function isFullData(value: unknown): value is FullData[] {
  return isCarArray(value) && isWinnerArray(value);
}

export function isModelData(value: unknown): value is ModalData {
  if (!isObject(value)) {
    return false;
  }
  return (
    CAR_KEYS.ID in value &&
    isPositiveNumber(value.id) &&
    CAR_KEYS.NAME in value &&
    isString(value.name) &&
    WINNER_KEYS.TIME in value &&
    isPositiveNumber(value.time)
  );
}

export function isSort(value: unknown): value is Sort {
  return value === Sort.ID || value === Sort.TIME || value === Sort.WINS;
}

export function isResponseData(value: unknown): value is ResponseData {
  if (!isObject(value)) {
    return false;
  }
  return RESPONSE_DATA_KEYS.DATA in value && RESPONSE_DATA_KEYS.COUNT in value;
}

export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}
