import type { Injectable } from "@/types/di-container-types.ts";

export type TypeGuard<T> = (value: unknown) => value is T;

export enum StorageKeys {
  carProperties = "carProperties",
  garage = "Garage",
  winners = "Winners",
}

export interface SessionStorageInterface extends Injectable {
  save(key: string, value: unknown): void;
  load<T>(key: string, typeGuard: TypeGuard<T>): T | null;
}
