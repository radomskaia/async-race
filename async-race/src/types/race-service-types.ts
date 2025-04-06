import type { AnimateCar } from "@/components/options/animate-car.ts";
import type { Injectable } from "@/types/di-container-types.ts";

export interface RaceServiceInterface extends Injectable {
  init(container: HTMLElement): void;
  addCar(id: number, element: SVGElement): void;
  resetCars(): void;
  startSingleRace(id: number): Promise<void>;
  stopSingleRace(id: number): Promise<void>;
  startRace(): Promise<void>;
  stopRace(): Promise<void>;
}

export interface RaceData {
  velocity: number;
  distance: number;
}

export interface AnimationData {
  id: number;
  element: SVGElement;
  duration: number;
  animation?: AnimateCar;
}
