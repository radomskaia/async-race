import type {
  Car,
  SetPageCallback,
  CarProperties,
  CarUpdateCallback,
  GetCarsHandler,
  ResponseData,
  RequestEngine,
  WinnerData,
} from "@/types";
import { REQUEST_METHOD } from "@/types";
import { API_URLS, RESPONSE_STATUS, ZERO } from "@/constants/constants.ts";
import { isResponseCarData, isWinnerData } from "@/services/validator.ts";

export class ApiHandler {
  private static instance: ApiHandler | undefined;
  private url = "http://192.168.88.124:3000";
  private headers = {
    "Content-Type": "application/json",
  };
  private garage = API_URLS.GARAGE;
  private engine = API_URLS.ENGINE;
  private winners = API_URLS.WINNERS;

  public static getInstance(): ApiHandler {
    if (!ApiHandler.instance) {
      ApiHandler.instance = new ApiHandler();
    }
    return ApiHandler.instance;
  }

  public static getTotalCountCars(response: Response): number {
    const total = response.headers.get("X-Total-Count");
    return total ? Number(total) : ZERO;
  }

  private static async getResponse(
    url: string,
    init?: RequestInit,
  ): Promise<Response> {
    let response;
    try {
      response = await fetch(url, init);
    } catch (error) {
      throw new Error(`Error while fetching data: ${error}`);
    }
    return response;
  }

  private static async getResponseData(
    url: string,
    init?: RequestInit,
  ): Promise<ResponseData> {
    const response = await this.getResponse(url, init);
    let totalCount;
    if (!response.ok) {
      throw response;
    }
    totalCount = ApiHandler.getTotalCountCars(response);
    if (totalCount < ZERO) {
      throw new Error("Invalid data");
    }
    return {
      data: await response.json(),
      count: totalCount,
    };
  }

  private static async getEngineData(
    url: string,
    init?: RequestInit,
  ): Promise<unknown> {
    const response = await this.getResponse(url, init);
    if (!response.ok) {
      throw response;
    }
    return await response.json();
  }

  public requestEngine: RequestEngine = async (status, id) => {
    const query = new URLSearchParams({
      id: String(id),
      status: status,
    });
    const url = `${this.url}${this.engine}?${query}`;
    let data;
    try {
      data = await ApiHandler.getEngineData(url, {
        method: REQUEST_METHOD.PATCH,
      });
      return data;
    } catch (error) {
      if (!(error instanceof Response)) {
        console.error(`Error while fetching data: ${error}`);
        return;
      }
      if (error.status === RESPONSE_STATUS.INTERNAL_SERVER_ERROR) {
        throw error;
      }
      console.error(error.statusText);
    }
  };

  public getCars: GetCarsHandler = async (page, limit) => {
    const query = new URLSearchParams({
      _page: String(page),
      _limit: String(limit),
    });
    const url = `${this.url}${this.garage}?${query}`;
    let data;
    try {
      data = await ApiHandler.getResponseData(url);
    } catch (error) {
      throw new Error(`Error while fetching data: ${error}`);
    }
    if (!isResponseCarData(data)) {
      throw new Error("Invalid data");
    }

    return data;
  };

  public async addWinner(data: WinnerData): Promise<void> {
    let url = `${this.url}${this.winners}`;
    let method;
    let initData = {};
    try {
      const responseData = await ApiHandler.getResponseData(
        `${url}/${data.id}`,
      );
      const winner = responseData.data;

      if (isWinnerData(winner)) {
        url += `/${data.id}`;
        initData = {
          wins: data.wins + winner.wins,
          time: Math.min(data.time, winner.time),
        };
        method = REQUEST_METHOD.PUT;
      } else {
        console.error("Invalid data");
      }
    } catch (error) {
      if (
        error instanceof Response &&
        error.status === RESPONSE_STATUS.NOT_FOUND
      ) {
        method = REQUEST_METHOD.POST;
        initData = data;
      } else {
        console.error(error);
      }
    } finally {
      const init = {
        headers: this.headers,
        method: method,
        body: JSON.stringify(initData),
      };
      void ApiHandler.getResponse(url, init);
    }
  }

  public async deleteCar(id: number, callback: SetPageCallback): Promise<void> {
    const url = `${this.url}${this.garage}/${id}`;

    try {
      await ApiHandler.getResponse(url, {
        method: REQUEST_METHOD.DELETE,
      });
      void Promise.allSettled([this.deleteWinner(id), callback(null)]);
    } catch (error) {
      console.error(error);
    }
  }

  public async updateCar(
    { id, ...properties }: Car,
    callback: CarUpdateCallback,
  ): Promise<void> {
    const url = `${this.url}${this.garage}/${id}`;
    const init = {
      method: REQUEST_METHOD.PUT,
      headers: this.headers,
      body: JSON.stringify(properties),
    };
    ApiHandler.getResponse(url, init)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(callback)
      .catch((error) => {
        console.error(error);
      });
  }

  public async createCar(
    properties: CarProperties,
    callback?: SetPageCallback,
  ): Promise<void> {
    const url = `${this.url}${this.garage}`;
    const init = {
      method: REQUEST_METHOD.POST,
      headers: this.headers,
      body: JSON.stringify(properties),
    };
    try {
      const response = await ApiHandler.getResponse(url, init);
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      callback?.(null, true);
    } catch (error) {
      console.error(error);
    }
  }

  private async deleteWinner(id: number): Promise<void> {
    const url = `${this.url}${this.winners}/${id}`;

    try {
      await ApiHandler.getResponse(url, {
        method: REQUEST_METHOD.DELETE,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
