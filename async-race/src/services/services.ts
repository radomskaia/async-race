import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { Router } from "@/services/router.ts";
import { ApiService } from "@/services/api/api-service.ts";
import { RaceService } from "@/services/race/race-service.ts";
import { EventEmitter } from "@/services/event-emitter.ts";
import { WinnerService } from "@/services/api/winner-service.ts";
import { GarageService } from "@/services/api/garage-service.ts";
import { EngineService } from "@/services/api/engine-service.ts";
import { SessionStorage } from "@/services/session-storage.ts";
import { Validator } from "@/services/validator.ts";

export function registerServices(): void {
  const diContainer = DIContainer.getInstance();
  diContainer.register(ServiceName.ROUTER, Router);
  diContainer.register(ServiceName.API, ApiService);
  diContainer.register(ServiceName.RACE, RaceService);
  diContainer.register(ServiceName.EVENT_EMITTER, EventEmitter);
  diContainer.register(ServiceName.WINNER, WinnerService);
  diContainer.register(ServiceName.GARAGE, GarageService);
  diContainer.register(ServiceName.ENGINE, EngineService);
  diContainer.register(ServiceName.STORAGE, SessionStorage);
  diContainer.register(ServiceName.VALIDATOR, Validator);
}
