import type { ApiServiceInterface } from "@/types/api-service-types.ts";
import type { RaceServiceInterface } from "@/types/race-service-types.ts";
import type { RouterInterface } from "@/types/router-type.ts";

export interface DIContainerInterface {
  register(name: ServiceName, service: new () => Injectable): void;

  getService(name: ServiceName): Injectable;
}

export interface Injectable {
  name: ServiceName;
}

export enum ServiceName {
  API = "apiService",
  RACE = "raceService",
  ROUTER = "router",
}

export interface ServiceMap {
  [ServiceName.API]: ApiServiceInterface;
  [ServiceName.RACE]: RaceServiceInterface;
  [ServiceName.ROUTER]: RouterInterface;
}
