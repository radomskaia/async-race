import type { Car, CarProperties, SetPageCallback } from "@/types/index.ts";
import type { RaceData } from "@/types/race-service-types.ts";

export type DeleteData = (url: string) => Promise<void>;

export type UpdateCar = ({ id, ...properties }: Car) => Promise<void>;

export type CreateCar = (
  properties: CarProperties,
  callback?: SetPageCallback,
) => Promise<unknown>;

export interface Winner {
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
) => Promise<RaceData>;

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
}

export interface ResponseWinnerData extends ResponseData {
  data: Winner[];
}

export type GetDataHandler = (url: string) => Promise<ResponseData>;

export interface PaginationParameters {
  page: number;
  limit: number;
}

export interface SortedParameters {
  sort: Sort;
  order: Order;
}

export interface SortedPaginationParameters
  extends PaginationParameters,
    SortedParameters {}

export type GetCarsHandler = (
  parameters: PaginationParameters,
) => Promise<ResponseCarData>;

export type GetWinnersHandler = (
  parameters: SortedPaginationParameters,
) => Promise<{
  count: number;
  data: FullData[];
}>;

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export enum Sort {
  ID = "id",
  WINS = "wins",
  TIME = "time",
}

export enum EngineStatus {
  STARTED = "started",
  STOPPED = "stopped",
  DRIVE = "drive",
}

export type CreateOrUpdateHandler = (
  url: string,
  data: unknown,
  signal?: AbortSignal,
) => Promise<unknown>;

export type SendData = (
  url: string,
  data: unknown,
  method: REQUEST_METHOD,
  signal?: AbortSignal,
) => Promise<unknown>;

export interface FullData extends Winner, Car {}
