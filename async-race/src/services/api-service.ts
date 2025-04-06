import {
  API_HEADER,
  API_URL,
  API_URLS,
  COUNT_HEADER,
  RESPONSE_STATUS,
  ZERO,
} from "@/constants/constants.ts";
import { isResponseCarData } from "@/services/validator.ts";
import type {
  GetCarsHandler,
  ApiServiceInterface,
  RequestEngine,
  ResponseData,
  DeleteCar,
  UpdateCar,
  CreateCar,
  CombinedResponse,
} from "@/types/api-service-types.ts";
import { REQUEST_METHOD } from "@/types/api-service-types.ts";
import { ServiceName } from "@/types/di-container-types";
import { DIContainer } from "@/services/di-container.ts";

export class ApiService implements ApiServiceInterface {
  public name: ServiceName = ServiceName.API;
  private url = API_URL;
  private headers = API_HEADER;
  private garage = API_URLS.GARAGE;
  private engine = API_URLS.ENGINE;
  private winnerServer;
  public constructor() {
    const diContainer = DIContainer.getInstance();
    this.winnerServer = diContainer.getService(ServiceName.WINNER);
  }

  public static getResponse: CombinedResponse<Response> = async (
    url,
    init?,
  ) => {
    let response;
    try {
      response = await fetch(url, init);
    } catch (error) {
      throw new Error(`Error while fetching data: ${error}`);
    }
    return response;
  };

  public static getResponseData: CombinedResponse<ResponseData> = async (
    url,
    init?,
  ) => {
    const response = await this.getResponse(url, init);
    let totalCount;
    if (!response.ok) {
      throw response;
    }
    totalCount = ApiService.getTotalCountCars(response);
    if (totalCount < ZERO) {
      throw new Error("Invalid data");
    }
    return {
      data: await response.json(),
      count: totalCount,
    };
  };

  private static getTotalCountCars(response: Response): number {
    const total = response.headers.get(COUNT_HEADER);
    return total ? Number(total) : ZERO;
  }

  private static getEngineData: CombinedResponse<unknown> = async (
    url,
    init?,
  ) => {
    const response = await this.getResponse(url, init);
    if (!response.ok) {
      throw response;
    }
    return await response.json();
  };

  public requestEngine: RequestEngine = async (status, id) => {
    const query = new URLSearchParams({
      id: String(id),
      status: status,
    });
    const url = `${this.url}${this.engine}?${query}`;
    let data;
    try {
      data = await ApiService.getEngineData(url, {
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
      data = await ApiService.getResponseData(url);
    } catch (error) {
      throw new Error(`Error while fetching data: ${error}`);
    }
    if (!isResponseCarData(data)) {
      throw new Error("Invalid data");
    }

    return data;
  };

  public deleteCar: DeleteCar = async (id) => {
    const url = `${this.url}${this.garage}/${id}`;

    try {
      await ApiService.getResponse(url, {
        method: REQUEST_METHOD.DELETE,
      });
      await this.winnerServer.delete(id);
    } catch (error) {
      console.error(error);
    }
  };

  public updateCar: UpdateCar = async ({ id, ...properties }, callback) => {
    const url = `${this.url}${this.garage}/${id}`;
    const init = {
      method: REQUEST_METHOD.PUT,
      headers: this.headers,
      body: JSON.stringify(properties),
    };
    ApiService.getResponse(url, init)
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
  };

  public createCar: CreateCar = async (properties) => {
    const url = `${this.url}${this.garage}`;
    const init = {
      method: REQUEST_METHOD.POST,
      headers: this.headers,
      body: JSON.stringify(properties),
    };
    try {
      const response = await ApiService.getResponse(url, init);
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
}
