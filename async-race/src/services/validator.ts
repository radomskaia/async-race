import { ZERO } from "@/constants/constants.ts";
import type { Car } from "@/types";

export class Validator {
  private static instance: Validator | undefined;

  public static getInstance(): Validator {
    if (!Validator.instance) {
      Validator.instance = new Validator();
    }
    return Validator.instance;
  }
  public static isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
  }

  public static isPositiveNumber(value: unknown): value is number {
    return Validator.isNumber(value) && value >= ZERO;
  }

  private static isObject(value: unknown): value is object {
    return typeof value === "object" && value !== null;
  }

  private static isString(value: unknown): value is string {
    return typeof value === "string";
  }

  private static isNumber(value: unknown): value is number {
    return typeof value === "number";
  }

  public isCar(value: unknown): value is Car {
    if (!Validator.isObject(value)) {
      return false;
    }
    if (!("name" in value && "color" in value && "id" in value)) {
      return false;
    }
    return (
      Validator.isString(value.name) &&
      Validator.isString(value.color) &&
      Validator.isNumber(value?.id)
    );
  }

  public isCarArray(value: unknown): value is Car[] {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((car) => this.isCar(car));
  }
}
