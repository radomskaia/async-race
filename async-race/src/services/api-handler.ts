import type {
  Car,
  SetPageCallback,
  CarProperties,
  CarUpdateCallback,
  GetCarsHandler,
} from "@/types";
import { API_URLS, ZERO } from "@/constants/constants.ts";
import { isResponseData } from "@/services/validator.ts";

export class ApiHandler {
  private static instance: ApiHandler | undefined;
  private url = "http://127.0.0.1:3000";
  private headers = {
    "Content-Type": "application/json",
  };
  private garage = API_URLS.GARAGE;
  // private engine = API_URLS.ENGINE;
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

  private static async getResponseData(url: string): Promise<unknown> {
    const response = await this.getResponse(url);
    let totalCount;
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    totalCount = ApiHandler.getTotalCountCars(response);
    return {
      data: await response.json(),
      count: totalCount,
    };
  }

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
    if (!isResponseData(data)) {
      throw new Error("Invalid data");
    }
    return data;
  };

  public async deleteCar(id: number, callback: SetPageCallback): Promise<void> {
    const url = `${this.url}${this.garage}/${id}`;

    try {
      await ApiHandler.getResponse(url, {
        method: "DELETE",
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
      method: "PUT",
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
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(properties),
    };
    try {
      await ApiHandler.getResponse(url, init);
      callback?.(null, true);
    } catch (error) {
      console.error(error);
    }
  }

  private async deleteWinner(id: number): Promise<void> {
    const url = `${this.url}${this.winners}/${id}`;

    try {
      await ApiHandler.getResponse(url, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
    }
  }
}
