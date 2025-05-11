import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { API_URLS, ERROR_MESSAGES } from "@/constants/constants.ts";
import { DIContainer } from "@/services/di-container.ts";
import type { RequestEngine } from "@/types/api-service-types.ts";
import { EngineStatus } from "@/types/api-service-types.ts";
import { REQUEST_METHOD } from "@/types/api-service-types.ts";
import type { RaceData } from "@/types/race-service-types.ts";
import { TypeNames } from "@/types/validator-types.ts";

export class EngineService implements Injectable {
  public name = ServiceName.ENGINE;
  private url = API_URLS.ENGINE;
  private apiService;
  private validator;

  constructor() {
    const diContainer = DIContainer.getInstance();
    this.apiService = diContainer.getService(ServiceName.API);
    this.validator = diContainer.getService(ServiceName.VALIDATOR);
  }

  public async start(id: number): Promise<RaceData> {
    return await this.requestEngine(EngineStatus.STARTED, id);
  }
  public async stop(id: number): Promise<RaceData> {
    return await this.requestEngine(EngineStatus.STOPPED, id);
  }
  public async drive(id: number, signal?: AbortSignal): Promise<number> {
    try {
      await this.requestEngine(EngineStatus.DRIVE, id, signal);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === ERROR_MESSAGES.INVALID_DATA
      ) {
        return id;
      }
      throw error;
    }
    return id;
  }

  private requestEngine: RequestEngine = async (status, id, signal?) => {
    const query = new URLSearchParams({
      id: String(id),
      status: status,
    });
    const url = `${this.url}?${query}`;
    let data: unknown;
    data = await this.apiService.patchData(url, {
      method: REQUEST_METHOD.PATCH,
      signal,
    });
    if (!this.validator.validate(TypeNames.raceData, data)) {
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
    }
    return data;
  };
}
