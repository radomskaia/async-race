import type { Car } from "@/types/index.ts";

export interface ApiServiceInterface {
  requestEngine: RequestEngine;

  getCars(
    page: number,
    limit: number,
  ): Promise<{
    data: Car[];
    count: number;
  }>;

  addWinner(data: WinnerData): Promise<void>;
}

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
) => Promise<unknown>;

export interface ResponseData {
  data: unknown;
  count: number;
}

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
