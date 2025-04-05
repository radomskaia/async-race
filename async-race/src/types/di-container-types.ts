import type { ApiServiceInterface } from "@/types/api-service-types.ts";
import type { RaceServiceInterface } from "@/types/race-service-types.ts";
import type { RouterInterface } from "@/types/router-type.ts";

export interface DIContainerInterface {
  register<T extends keyof ServiceMap>(
    name: ServiceName,
    service: new () => ServiceMap[T],
  ): void;

  getService<T extends keyof ServiceMap>(name: ServiceName): ServiceMap[T];
}

export enum ServiceName {
  API = "apiService",
  RACE = "raceService",
  ROUTER = "router",
}

export type ServiceTypes =
  | ApiServiceInterface
  | RaceServiceInterface
  | RouterInterface;

export interface ServiceMap {
  [key: string]: ServiceTypes;

  [ServiceName.API]: ApiServiceInterface;
  [ServiceName.RACE]: RaceServiceInterface;
  [ServiceName.ROUTER]: RouterInterface;
}
