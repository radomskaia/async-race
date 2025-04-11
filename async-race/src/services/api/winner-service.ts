import type {
  FullData,
  GetWinnersHandler,
  Winner,
} from "@/types/api-service-types.ts";
import { API_URLS, ERROR_MESSAGES } from "@/constants/constants.ts";
import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { TypeNames } from "@/types/validator-types.ts";

export class WinnerService implements Injectable {
  public name = ServiceName.WINNER;
  private url = API_URLS.WINNERS;
  private apiService;
  private diContainer;
  private validator;

  constructor() {
    this.diContainer = DIContainer.getInstance();
    this.apiService = this.diContainer.getService(ServiceName.API);
    this.validator = this.diContainer.getService(ServiceName.VALIDATOR);
  }

  private static createData(newData: Winner, oldData?: Winner): Winner {
    if (!oldData) {
      return newData;
    }
    return {
      id: newData.id,
      wins: newData.wins + oldData.wins,
      time: Math.min(newData.time, oldData.time),
    };
  }

  public async deleteWinner(id: number): Promise<void> {
    const url = `${this.url}/${id}`;
    void this.apiService.deleteData(url);
  }

  public async create(data: Winner): Promise<void> {
    let initData: Winner | undefined;
    let isCreate = false;
    try {
      initData = await this.getWinner(data.id);
    } catch {
      isCreate = true;
    } finally {
      const newData = WinnerService.createData(data, initData);
      const url = isCreate ? this.url : `${this.url}/${data.id}`;
      void (isCreate
        ? this.apiService.createData(url, newData)
        : this.apiService.updateData(url, newData));
      void this.notify(newData);
    }
  }

  public async notify(winnerData: Winner): Promise<void> {
    const id = winnerData.id;
    const data = await this.diContainer
      .getService(ServiceName.GARAGE)
      .getCar(id);
    this.diContainer.getService(ServiceName.EVENT_EMITTER).notify({
      type: ActionType.winnerDetected,
      data: { name: data.name, id, time: winnerData.time },
    });
  }

  public async getWinner(id: number): Promise<Winner> {
    const url = `${this.url}/${id}`;
    let data: unknown;

    data = await this.apiService.getData(url);
    if (
      !this.validator.validate(TypeNames.responseData, data) ||
      !this.validator.validate(TypeNames.winner, data.data)
    ) {
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
    }
    return data.data;
  }

  public getPage: GetWinnersHandler = async (parameters) => {
    const query = new URLSearchParams({
      _page: String(parameters.page),
      _limit: String(parameters.limit),
      _sort: parameters.sort,
      _order: parameters.order,
    });
    const url = `${this.url}?${query}`;
    let data: unknown;

    data = await this.apiService.getData(url);
    if (!this.validator.validate(TypeNames.responseWinnerData, data)) {
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
    }
    const result: {
      count: number;
      data: FullData[];
    } = {
      count: data.count,
      data: [],
    };
    for (const { id } of data.data) {
      const carData = await this.diContainer
        .getService(ServiceName.GARAGE)
        .getCar(id);
      const winner = data.data.find((item) => item.id === id);
      if (winner) {
        result.data.push({ ...winner, ...carData });
      }
    }
    return result;
  };
}
