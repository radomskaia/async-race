import type { AnimateCar } from "@/components/options/animate-car.ts";

export interface RaceServiceInterface {
  init(container: HTMLElement): void;
  addCar(id: number, element: SVGElement): void;
  resetCars(): void;
  startSingleRace(id: number): Promise<void>;
  stopSingleRace(id: number): void;
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
