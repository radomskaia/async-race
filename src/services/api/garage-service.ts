import { DIContainer } from "@/services/di-container.ts";
import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { API_URLS, ERROR_MESSAGES } from "@/constants/constants.ts";
import type {
  CreateCar,
  GetCarsHandler,
  UpdateCar,
} from "@/types/api-service-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import type { Car } from "@/types";
import { TypeNames } from "@/types/validator-types.ts";

export class GarageService implements Injectable {
  public name = ServiceName.GARAGE;
  private url = API_URLS.GARAGE;
  private apiService;
  private winnerService;
  private eventEmitter;
  private validator;
  constructor() {
    const diContainer = DIContainer.getInstance();
    this.apiService = diContainer.getService(ServiceName.API);
    this.winnerService = diContainer.getService(ServiceName.WINNER);
    this.eventEmitter = diContainer.getService(ServiceName.EVENT_EMITTER);
    this.validator = diContainer.getService(ServiceName.VALIDATOR);
  }

  public async deleteCar(id: number): Promise<void> {
    const url = `${this.url}/${id}`;
    await this.apiService.deleteData(url);
    void this.winnerService.deleteWinner(id);
  }

  public getPage: GetCarsHandler = async (parameters) => {
    const query = new URLSearchParams({
      _page: String(parameters.page),
      _limit: String(parameters.limit),
    });
    const url = `${this.url}?${query}`;
    let data: unknown;

    data = await this.apiService.getData(url);
    if (!this.validator.validate(TypeNames.responseCarData, data)) {
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
    }
    return data;
  };

  public createCar: CreateCar = async (properties) => {
    return await this.apiService.createData(this.url, properties);
  };

  public updateCar: UpdateCar = async ({ id, ...properties }) => {
    const url = `${this.url}/${id}`;
    await this.apiService.updateData(url, properties);
    this.eventEmitter.notify({
      type: ActionType.updateCar,
      data: { id, ...properties },
    });
  };

  public async getCar(id: number): Promise<Car> {
    const url = `${this.url}/${id}`;
    let data: unknown;

    data = await this.apiService.getData(url);
    if (
      !this.validator.validate(TypeNames.responseData, data) ||
      !this.validator.validate(TypeNames.car, data.data)
    ) {
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
    }
    return data.data;
  }
}
