import type { AnimateCar } from "@/services/race/animate-car.ts";

export interface RaceData extends Record<string, number> {
  velocity: number;
  distance: number;
}

export interface AnimationData {
  id: number;
  element: SVGElement;
  duration: number;
  animation?: AnimateCar;
}
