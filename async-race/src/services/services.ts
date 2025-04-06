import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { Router } from "@/services/router.ts";
import { ApiService } from "@/services/api-service.ts";
import { RaceService } from "@/services/race-service.ts";
import { EventEmitter } from "@/services/event-emitter.ts";

export function registerServices(): void {
  const diContainer = DIContainer.getInstance();
  diContainer.register(ServiceName.ROUTER, Router);
  diContainer.register(ServiceName.API, ApiService);
  diContainer.register(ServiceName.RACE, RaceService);
  diContainer.register(ServiceName.EVENT_EMITTER, EventEmitter);
}
