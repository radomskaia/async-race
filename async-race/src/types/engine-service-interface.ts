import type { Injectable } from "@/types/di-container-types.ts";
import type { RaceData } from "@/types/race-service-types.ts";

export interface EngineServiceInterface extends Injectable {
  start(id: number): Promise<RaceData>;
  stop(id: number): Promise<void>;
  drive(id: number, signal?: AbortSignal): Promise<void>;
}
