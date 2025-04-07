import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { API_URLS } from "@/constants/constants.ts";
import type {
  CreateCar,
  GetCarsHandler,
  UpdateCar,
} from "@/types/api-service-types.ts";
import {
  isCar,
  isResponseCarData,
  isResponseData,
} from "@/services/validator.ts";
import type { GarageServiceInterface } from "@/types/garage-service-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import type { Car } from "@/types";

export class GarageService implements GarageServiceInterface {
  public name = ServiceName.GARAGE;
  private url = API_URLS.GARAGE;
  private apiService;
  private winnerService;
  private eventEmitter;
  constructor() {
    const diContainer = DIContainer.getInstance();
    this.apiService = diContainer.getService(ServiceName.API);
    this.winnerService = diContainer.getService(ServiceName.WINNER);
    this.eventEmitter = diContainer.getService(ServiceName.EVENT_EMITTER);
  }

  public async deleteCar(id: number): Promise<void> {
    const url = `${this.url}/${id}`;
    await this.apiService.deleteData(url);
    void this.winnerService.deleteWinner(id);
  }

  public getPage: GetCarsHandler = async (page, limit) => {
    const query = new URLSearchParams({
      _page: String(page),
      _limit: String(limit),
    });
    const url = `${this.url}?${query}`;
    let data: unknown;

    data = await this.apiService.getData(url);
    if (!isResponseCarData(data)) {
      throw new Error("Invalid data");
    }
    return data;
  };

  public createCar: CreateCar = async (properties) => {
    void this.apiService.createData(this.url, properties);
  };

  public updateCar: UpdateCar = async ({ id, ...properties }) => {
    const url = `${this.url}/${id}`;
    await this.apiService.updateData(url, properties);
    this.eventEmitter.notify({ type: ActionType.updateCar, data: properties });
  };

  public async getCar(id: number): Promise<Car> {
    const url = `${this.url}/${id}`;
    let data: unknown;

    data = await this.apiService.getData(url);
    if (!isResponseData(data) || !isCar(data.data)) {
      console.log(data);
      throw new Error("Invalid data");
    }
    return data.data;
  }
}
