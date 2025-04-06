import type { ApiServiceInterface } from "@/types/api-service-types.ts";
import type { RaceServiceInterface } from "@/types/race-service-types.ts";
import type { RouterInterface } from "@/types/router-type.ts";
import type { EventEmitterInterface } from "@/types/event-emitter-types.ts";
import type { WinnerServiceInterface } from "@/types/winner-service.ts";

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
  EVENT_EMITTER = "eventEmitter",
  WINNER = "winnerService",
}

export interface ServiceMap {
  [ServiceName.API]: ApiServiceInterface;
  [ServiceName.RACE]: RaceServiceInterface;
  [ServiceName.ROUTER]: RouterInterface;
  [ServiceName.EVENT_EMITTER]: EventEmitterInterface;
  [ServiceName.WINNER]: WinnerServiceInterface;
}
