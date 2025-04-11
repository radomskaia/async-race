import type { Injectable } from "@/types/di-container-types.ts";
import type { TypeNames, TypesForValidator } from "@/types/validator-types.ts";

export enum StorageKeys {
  sort = "sort",
  isASC = "isASC",
  garage = "Garage",
  winners = "Winners",
  carProperties = "CarProperties",
}

export interface SessionStorageInterface extends Injectable {
  save(key: string, value: unknown): void;
  load<T extends TypeNames>(
    key: string,
    typeName: T,
  ): TypesForValidator[T] | null;
}
