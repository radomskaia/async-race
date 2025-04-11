import type { EventEmitter } from "@/services/event-emitter.ts";
import type { RaceService } from "@/services/race/race-service.ts";
import type { ApiService } from "@/services/api/api-service.ts";
import type { Router } from "@/services/router.ts";
import type { WinnerService } from "@/services/api/winner-service.ts";
import type { GarageService } from "@/services/api/garage-service.ts";
import type { EngineService } from "@/services/api/engine-service.ts";
import type { SessionStorage } from "@/services/session-storage.ts";
import type { Validator } from "@/services/validator.ts";

export interface Injectable {
  name: ServiceName;
}

export enum ServiceName {
  API = "apiService",
  RACE = "raceService",
  ROUTER = "router",
  EVENT_EMITTER = "eventEmitter",
  WINNER = "winnerService",
  GARAGE = "garageService",
  ENGINE = "engineService",
  STORAGE = "sessionStorage",
  VALIDATOR = "validator",
}

export interface ServiceMap {
  [ServiceName.API]: ApiService;
  [ServiceName.RACE]: RaceService;
  [ServiceName.ROUTER]: Router;
  [ServiceName.EVENT_EMITTER]: EventEmitter;
  [ServiceName.WINNER]: WinnerService;
  [ServiceName.GARAGE]: GarageService;
  [ServiceName.ENGINE]: EngineService;
  [ServiceName.STORAGE]: SessionStorage;
  [ServiceName.VALIDATOR]: Validator;
}
