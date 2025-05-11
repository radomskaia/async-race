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
  Winner,
} from "@/types/api-service-types.ts";
import { Sort } from "@/types/api-service-types.ts";
import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import type { RaceData } from "@/types/race-service-types.ts";
import type { TypesForValidator } from "@/types/validator-types.ts";
import { TypeNames } from "@/types/validator-types.ts";

export class Validator implements Injectable {
  public name = ServiceName.VALIDATOR;
  private privateTypes = {
    object: TypeNames.object,
    string: TypeNames.string,
    number: TypeNames.number,
    boolean: TypeNames.boolean,
  };

  private typesConfig = {
    [TypeNames.object]: (value: unknown): value is object =>
      this.isObject(value),
    [TypeNames.string]: (value: unknown): value is string =>
      this.isString(value),
    [TypeNames.number]: (value: unknown): value is number =>
      this.isNumber(value),
    [TypeNames.positiveNumber]: (value: unknown): value is number =>
      this.isPositiveNumber(value),
    [TypeNames.boolean]: (value: unknown): value is boolean =>
      this.isBoolean(value),
    [TypeNames.responseCarData]: (value: unknown): value is ResponseCarData =>
      this.isResponseCarData(value),
    [TypeNames.responseWinnerData]: (
      value: unknown,
    ): value is ResponseWinnerData => this.isResponseWinnerData(value),
    [TypeNames.responseData]: (value: unknown): value is ResponseData =>
      this.isResponseData(value),
    [TypeNames.raceData]: (value: unknown): value is RaceData =>
      this.isRaceData(value),
    [TypeNames.carArray]: (value: unknown): value is Car[] =>
      this.isCarArray(value),
    [TypeNames.winnerArray]: (value: unknown): value is Winner[] =>
      this.isWinnerArray(value),
    [TypeNames.car]: (value: unknown): value is Car => this.isCar(value),
    [TypeNames.winner]: (value: unknown): value is Winner =>
      this.isWinner(value),
    [TypeNames.carProperties]: (value: unknown): value is CarProperties =>
      this.isCarProperties(value),
    [TypeNames.modalData]: (value: unknown): value is ModalData =>
      this.isModelData(value),
    [TypeNames.sort]: Validator.isSort,
    [TypeNames.fullData]: (value: unknown): value is FullData[] =>
      this.isFullData(value),
  };

  private static isArrayOf<T>(
    value: unknown,
    check: (item: unknown) => item is T,
  ): value is T[] {
    return Array.isArray(value) && value.every((element) => check(element));
  }

  private static isSort(value: unknown): value is Sort {
    return value === Sort.ID || value === Sort.TIME || value === Sort.WINS;
  }

  public validate<T extends TypeNames>(
    typeName: T,
    value: unknown,
  ): value is TypesForValidator[T] {
    return this.typesConfig[typeName](value);
  }

  private isObject(value: unknown): value is object {
    return typeof value === this.privateTypes.object && value !== null;
  }

  private isString(value: unknown): value is string {
    return typeof value === this.privateTypes.string;
  }

  private isNumber(value: unknown): value is number {
    return typeof value === this.privateTypes.number;
  }

  private isBoolean(value: unknown): value is boolean {
    return typeof value === this.privateTypes.boolean;
  }

  private isPositiveNumber(value: unknown): value is number {
    return this.isNumber(value) && value >= ZERO;
  }

  private isResponseCarData(value: unknown): value is ResponseCarData {
    if (!this.isResponseData(value)) {
      return false;
    }
    return this.isCarArray(value.data);
  }

  private isResponseWinnerData(value: unknown): value is ResponseWinnerData {
    if (!this.isResponseData(value)) {
      return false;
    }
    return this.isWinnerArray(value.data);
  }

  private isResponseData(value: unknown): value is ResponseData {
    if (!this.isObject(value)) {
      return false;
    }
    return (
      RESPONSE_DATA_KEYS.DATA in value && RESPONSE_DATA_KEYS.COUNT in value
    );
  }

  private isRaceData(value: unknown): value is RaceData {
    if (!this.isObject(value)) {
      return false;
    }
    if (!(RACE_KEYS.DISTANCE in value && RACE_KEYS.VELOCITY in value)) {
      return false;
    }
    return (
      this.isPositiveNumber(value.distance) &&
      this.isPositiveNumber(value.velocity)
    );
  }

  private isCarArray(value: unknown): value is Car[] {
    return Validator.isArrayOf(value, this.isCar.bind(this));
  }

  private isWinnerArray(value: unknown): value is Winner[] {
    return Validator.isArrayOf(value, this.isWinner.bind(this));
  }

  private isFullData(value: unknown): value is FullData[] {
    return this.isCarArray(value) && this.isWinnerArray(value);
  }

  private isCar(value: unknown): value is Car {
    if (!this.isObject(value)) {
      return false;
    }

    return (
      this.checkCarProperties(value) &&
      CAR_KEYS.ID in value &&
      this.isPositiveNumber(value.id)
    );
  }

  private isWinner(value: unknown): value is Winner {
    if (!this.isObject(value)) {
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
      this.isPositiveNumber(value.id) &&
      this.isPositiveNumber(value.time) &&
      this.isPositiveNumber(value.wins)
    );
  }

  private isCarProperties(value: unknown): value is CarProperties {
    return this.checkCarProperties(value);
  }

  private checkCarProperties(value: unknown): boolean {
    if (!this.isObject(value)) {
      return false;
    }
    if (!(CAR_KEYS.NAME in value && CAR_KEYS.COLOR in value)) {
      return false;
    }

    return this.isString(value.name) && this.isString(value.color);
  }

  private isModelData(value: unknown): value is ModalData {
    if (!this.isObject(value)) {
      return false;
    }
    return (
      CAR_KEYS.ID in value &&
      this.isPositiveNumber(value.id) &&
      CAR_KEYS.NAME in value &&
      this.isString(value.name) &&
      WINNER_KEYS.TIME in value &&
      this.isPositiveNumber(value.time)
    );
  }
}
