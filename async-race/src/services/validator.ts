import { ZERO } from "@/constants/constants.ts";
import type { Car, ResponseData } from "@/types";

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isResponseData(value: unknown): value is ResponseData {
  if (!isObject(value)) {
    return false;
  }
  return (
    "data" in value &&
    isCarArray(value.data) &&
    "count" in value &&
    isPositiveNumber(value.count)
  );
}

function isPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value >= ZERO;
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

function isCar(value: unknown): value is Car {
  if (!isObject(value)) {
    return false;
  }
  if (!("name" in value && "color" in value && "id" in value)) {
    return false;
  }
  return isString(value.name) && isString(value.color) && isNumber(value?.id);
}

function isCarArray(value: unknown): value is Car[] {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((car) => isCar(car));
}
