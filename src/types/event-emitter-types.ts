import type { Callback } from "@/types/button-types.ts";

export enum ActionType {
  listUpdated = "listUpdated",
  winnerDetected = "winnerDetected",
  raceStarted = "raceStarted",
  raceEnded = "raceEnded",
  singleRaceStarted = "singleRaceStarted",
  singleRaceEnded = "singleRaceEnded",
  updateCar = "updateCar",
  paginationUpdated = "paginationUpdated",
  changeRoute = "changeRoute",
  enginesStarted = "enginesStarted",
}

export type RegisterObserver = (
  eventType: ActionType,
  observer: Observer,
) => void;

export interface Action {
  type: ActionType;
  data?: unknown;
}

export interface Observer {
  update(event: Action): void;
}

export type RegisterEvent = (eventType: ActionType, callback: Callback) => void;
