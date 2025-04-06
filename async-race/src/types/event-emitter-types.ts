import type { Injectable } from "@/types/di-container-types.ts";
import type { Callback } from "@/types/button-types.ts";

export enum ActionType {
  listUpdated = "listUpdated",
  winnerDetected = "winnerDetected",
  raceStarted = "raceStarted",
  raceEnded = "raceEnded",
  singleRaceStarted = "singleRaceStarted",
}

export interface EventEmitterInterface extends Injectable {
  subscribe: RegisterObserver;
  unsubscribe: RegisterObserver;
  notify(action: Action): void;
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
