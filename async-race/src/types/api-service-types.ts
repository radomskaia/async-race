import type {
  Car,
  CarProperties,
  CarUpdateCallback,
  SetPageCallback,
} from "@/types/index.ts";
import type { Injectable } from "@/types/di-container-types.ts";

export interface ApiServiceInterface extends Injectable {
  requestEngine: RequestEngine;
  deleteCar: DeleteCar;
  updateCar: UpdateCar;
  createCar: CreateCar;
  getCars: GetCarsHandler;
}

export type DeleteCar = (id: number) => Promise<void>;

export type UpdateCar = (
  { id, ...properties }: Car,
  callback: CarUpdateCallback,
) => Promise<void>;

export type CreateCar = (
  properties: CarProperties,
  callback?: SetPageCallback,
) => Promise<void>;

export interface WinnerData {
  id: number;
  wins: number;
  time: number;
}

export enum REQUEST_METHOD {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export type RequestEngine = (
  status: EngineStatus,
  carId: number,
  signal?: AbortSignal,
) => Promise<unknown>;

export interface ResponseData {
  data: unknown;
  count: number;
}

export type CombinedResponse<T> = (
  url: string,
  init?: RequestInit,
) => Promise<T>;

export interface ResponseCarData extends ResponseData {
  data: Car[];
  count: number;
}

export type GetCarsHandler = (
  page: number,
  limit: number,
) => Promise<ResponseCarData>;

export enum EngineStatus {
  STARTED = "started",
  STOPPED = "stopped",
  DRIVE = "drive",
}
