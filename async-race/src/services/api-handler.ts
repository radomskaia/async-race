import { Validator } from "@/services/validator.ts";
import type { Car, CarProperties } from "@/types";
import { API_URLS, ZERO } from "@/constants/constants.ts";

export class ApiHandler {
  private static instance: ApiHandler | undefined;
  private readonly validator: Validator;
  private url = "http://127.0.0.1:3000";
  private headers = {
    "Content-Type": "application/json",
  };
  private garage = API_URLS.GARAGE;
  private engine = API_URLS.ENGINE;
  private winners = API_URLS.WINNERS;
  private constructor() {
    this.validator = Validator.getInstance();
  }
  public static getInstance(): ApiHandler {
    if (!ApiHandler.instance) {
      ApiHandler.instance = new ApiHandler();
    }
    return ApiHandler.instance;
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
    return response.json();
  }

  private static async getResponseHeaders(
    url: string,
    headerName: string,
  ): Promise<string | null> {
    const response = await this.getResponse(url);
    return response.headers.get(headerName);
  }

  public async getCars(page?: number): Promise<Car[]> {
    let url = `${this.url}${this.garage}`;
    if (page) {
      url += `?page=${page}&_limit=7`;
    }
    let data;
    try {
      data = await ApiHandler.getResponseData(url);
    } catch (error) {
      throw new Error(`Error while fetching data: ${error}`);
    }
    if (this.validator.isCarArray(data)) {
      return data;
    }
    return [];
  }

  public async deleteCar(id: number): Promise<void> {
    const url = `${this.url}${this.garage}/${id}`;

    ApiHandler.getResponse(url, {
      method: "DELETE",
    }).catch((error) => {
      console.error(error);
    });
  }

  public async updateCar({ id, ...properties }: Car): Promise<void> {
    const url = `${this.url}${this.garage}/${id}`;
    const init = {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(properties),
    };
    ApiHandler.getResponse(url, init).catch((error) => {
      console.error(error);
    });
  }

  public async createCar(properties: CarProperties): Promise<Car> {
    const url = `${this.url}${this.garage}`;
    const init = {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(properties),
    };
    return ApiHandler.getResponse(url, init)
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
  }

  public async getTotalCountCars(): Promise<number> {
    let url = `${this.url}${this.garage}?_limit=[]`;
    const totalCount = await ApiHandler.getResponseHeaders(
      url,
      "X-Total-Count",
    );
    if (totalCount && Validator.isPositiveNumber(totalCount)) {
      return totalCount;
    }
    return ZERO;
  }
}
