import { ServiceName } from "@/types/di-container-types.ts";
import { API_URLS } from "@/constants/constants.ts";
import { DIContainer } from "@/services/di-container.ts";
import type { EngineServiceInterface } from "@/types/engine-service-interface.ts";
import type { RequestEngine } from "@/types/api-service-types.ts";
import { EngineStatus } from "@/types/api-service-types.ts";
import { REQUEST_METHOD } from "@/types/api-service-types.ts";
import type { RaceData } from "@/types/race-service-types.ts";
import { isRaceData } from "@/services/validator.ts";

export class EngineService implements EngineServiceInterface {
  public name = ServiceName.ENGINE;
  private url = API_URLS.ENGINE;
  private apiService;
  private diContainer;

  constructor() {
    this.diContainer = DIContainer.getInstance();
    this.apiService = this.diContainer.getService(ServiceName.API);
  }

  public async start(id: number): Promise<RaceData> {
    const data = await this.requestEngine(EngineStatus.STOPPED, id);
    if (!isRaceData(data)) {
      throw new Error(`Invalid data`);
    }
    return data;
  }
  public async stop(id: number): Promise<void> {
    await this.requestEngine(EngineStatus.STOPPED, id);
  }
  public async drive(id: number, signal?: AbortSignal): Promise<void> {
    await this.requestEngine(EngineStatus.STOPPED, id, signal);
  }

  private requestEngine: RequestEngine = async (status, id, signal?) => {
    const query = new URLSearchParams({
      id: String(id),
      status: status,
    });
    const url = `${this.url}?${query}`;
    let data;
    data = await this.apiService.patchData(url, {
      method: REQUEST_METHOD.PATCH,
      signal,
    });
    return data;
  };
}
