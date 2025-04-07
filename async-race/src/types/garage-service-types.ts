import type { Injectable } from "@/types/di-container-types.ts";
import type {
  CreateCar,
  GetCarsHandler,
  UpdateCar,
} from "@/types/api-service-types.ts";
import type { Car } from "@/types/index.ts";

export interface GarageServiceInterface extends Injectable {
  getPage: GetCarsHandler;
  createCar: CreateCar;
  updateCar: UpdateCar;
  deleteCar(id: number): Promise<void>;
  getCar(id: number): Promise<Car>;
}
