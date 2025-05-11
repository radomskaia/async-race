import {
  API_HEADER,
  API_URL,
  COUNT_HEADER,
  ERROR_MESSAGES,
  ZERO,
} from "@/constants/constants.ts";
import type {
  ResponseData,
  DeleteData,
  CombinedResponse,
  GetDataHandler,
  CreateOrUpdateHandler,
  SendData,
} from "@/types/api-service-types.ts";
import { REQUEST_METHOD } from "@/types/api-service-types.ts";
import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { errorHandler } from "@/utilities/utilities.ts";
import { DIContainer } from "@/services/di-container.ts";
import { TypeNames } from "@/types/validator-types.ts";

export class ApiService implements Injectable {
  public name: ServiceName = ServiceName.API;
  private baseUrl = API_URL;
  private headers = API_HEADER;

  public static getResponse: CombinedResponse<Response> = async (
    url,
    init?,
  ) => {
    const response = await fetch(url, init);
    if (init?.signal?.aborted) {
      throw new Error(ERROR_MESSAGES.ABORTED);
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
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
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

  public getData: GetDataHandler = async (url) => {
    const baseUrl = `${this.baseUrl}${url}`;
    let data;
    try {
      data = await ApiService.getResponseData(baseUrl);
    } catch (error) {
      throw new Error(`${ERROR_MESSAGES.FETCH}${error}`);
    }

    const validator = DIContainer.getInstance().getService(
      ServiceName.VALIDATOR,
    );
    if (!validator.validate(TypeNames.responseData, data)) {
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
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
      errorHandler(error);
    }
  };

  public updateData: CreateOrUpdateHandler = async (url, data, signal?) => {
    return await this.sendData(url, data, REQUEST_METHOD.PUT, signal);
  };

  public createData: CreateOrUpdateHandler = async (url, data, signal?) => {
    return await this.sendData(url, data, REQUEST_METHOD.POST, signal);
  };

  public patchData: CreateOrUpdateHandler = async (url, data, signal?) => {
    return await this.sendData(url, data, REQUEST_METHOD.PATCH, signal);
  };

  private sendData: SendData = async (url, data, method, signal?) => {
    const baseUrl = `${this.baseUrl}${url}`;
    const init: RequestInit = { method, signal };

    if (method !== REQUEST_METHOD.PATCH) {
      init.headers = this.headers;
      init.body = JSON.stringify(data);
    }
    const response = await ApiService.getResponse(baseUrl, init);
    if (!response.ok) {
      throw response;
    }
    return await response.json();
  };
}
