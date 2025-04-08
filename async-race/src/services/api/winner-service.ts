import type {
  FullData,
  GetWinnersHandler,
  WinnerData,
} from "@/types/api-service-types.ts";
import {
  isResponseData,
  isResponseWinnerData,
  isWinnerData,
} from "@/services/validator.ts";
import { API_URLS } from "@/constants/constants.ts";
import type { WinnerServiceInterface } from "@/types/winner-service.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ActionType } from "@/types/event-emitter-types.ts";

export class WinnerService implements WinnerServiceInterface {
  public name = ServiceName.WINNER;
  private url = API_URLS.WINNERS;
  private apiService;
  private diContainer;

  constructor() {
    this.diContainer = DIContainer.getInstance();
    this.apiService = this.diContainer.getService(ServiceName.API);
  }

  private static createData(
    newData: WinnerData,
    oldData?: WinnerData,
  ): WinnerData {
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

  public async create(data: WinnerData): Promise<void> {
    let initData: WinnerData | undefined;
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

  public async notify(winnerData: WinnerData): Promise<void> {
    const id = winnerData.id;
    const data = await this.diContainer
      .getService(ServiceName.GARAGE)
      .getCar(id);
    this.diContainer.getService(ServiceName.EVENT_EMITTER).notify({
      type: ActionType.winnerDetected,
      data: { name: data.name, id, time: winnerData.time },
    });
  }

  public async getWinner(id: number): Promise<WinnerData> {
    const url = `${this.url}/${id}`;
    let data: unknown;

    data = await this.apiService.getData(url);
    if (!isResponseData(data) || !isWinnerData(data.data)) {
      console.log(data);
      throw new Error("Invalid data");
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
    if (!isResponseWinnerData(data)) {
      throw new Error("Invalid data");
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
