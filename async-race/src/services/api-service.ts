import {
  API_HEADER,
  API_URL,
  API_URLS,
  COUNT_HEADER,
  ZERO,
} from "@/constants/constants.ts";
import type {
  ApiServiceInterface,
  RequestEngine,
  ResponseData,
  DeleteData,
  CombinedResponse,
  GetDataHandler,
  CreateOrUpdateHandler,
  SendData,
} from "@/types/api-service-types.ts";
import { REQUEST_METHOD } from "@/types/api-service-types.ts";
import { ServiceName } from "@/types/di-container-types";
import { isResponseData } from "@/services/validator.ts";

export class ApiService implements ApiServiceInterface {
  public name: ServiceName = ServiceName.API;
  private baseUrl = API_URL;
  private headers = API_HEADER;
  private engine = API_URLS.ENGINE;

  public static getResponse: CombinedResponse<Response> = async (
    url,
    init?,
  ) => {
    const response = await fetch(url, init);
    if (init?.signal?.aborted) {
      throw new Error("Aborted");
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

  public requestEngine: RequestEngine = async (status, id, signal?) => {
    const query = new URLSearchParams({
      id: String(id),
      status: status,
    });
    const url = `${this.baseUrl}${this.engine}?${query}`;
    let data;
    data = await ApiService.getEngineData(url, {
      method: REQUEST_METHOD.PATCH,
      signal,
    });
    return data;
  };

  public getData: GetDataHandler = async (url) => {
    const baseUrl = `${this.baseUrl}${url}`;
    let data;
    try {
      data = await ApiService.getResponseData(baseUrl);
    } catch (error) {
      throw new Error(`Error while fetching data: ${error}`);
    }
    if (!isResponseData(data)) {
      throw new Error("Invalid data");
    }
    return data;
  };

  public deleteData: DeleteData = async (url) => {
    const baseUrl = `${this.baseUrl}${url}`;

    try {
      await ApiService.getResponse(baseUrl, {
        method: REQUEST_METHOD.DELETE,
      });
    } catch (error) {
      console.error(error);
    }
  };

  public updateData: CreateOrUpdateHandler = async (url, data) => {
    void this.sendData(url, data, REQUEST_METHOD.PUT);
  };

  public createData: CreateOrUpdateHandler = async (url, data) => {
    void this.sendData(url, data, REQUEST_METHOD.POST);
  };

  private sendData: SendData = async (url, data, method) => {
    const baseUrl = `${this.baseUrl}${url}`;
    const init = {
      method,
      headers: this.headers,
      body: JSON.stringify(data),
    };

    try {
      const response = await ApiService.getResponse(baseUrl, init);
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
}
