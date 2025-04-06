import type { WinnerData } from "@/types/api-service-types.ts";
import { REQUEST_METHOD } from "@/types/api-service-types.ts";
import { isWinnerArray, isWinnerData } from "@/services/validator.ts";
import { API_URL, API_URLS, RESPONSE_STATUS } from "@/constants/constants.ts";
import { ApiService } from "@/services/api-service.ts";
import type { WinnerServiceInterface } from "@/types/winner-service.ts";
import { ServiceName } from "@/types/di-container-types";
import { DIContainer } from "@/services/di-container.ts";
import { ActionType } from "@/types/event-emitter-types.ts";

export class WinnerService implements WinnerServiceInterface {
  public name = ServiceName.WINNER;
  private url = `${API_URL}${API_URLS.WINNERS}`;
  private headers = {
    "Content-Type": `application/json`,
  };

  private static createData(
    newData: WinnerData,
    oldData: WinnerData | null,
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

  public async delete(id: number): Promise<void> {
    const url = `${this.url}/${id}`;

    try {
      await ApiService.getResponse(url, {
        method: REQUEST_METHOD.DELETE,
      });
    } catch (error) {
      console.error(error);
    }
  }

  public async create(data: WinnerData): Promise<void> {
    try {
      const initData = await this.getWinner(data.id);
      const isUpdated = !!initData;
      const url = isUpdated ? `${this.url}/${data.id}` : this.url;
      const method = isUpdated ? REQUEST_METHOD.PUT : REQUEST_METHOD.POST;
      const winnerData = WinnerService.createData(data, initData);
      DIContainer.getInstance()
        .getService(ServiceName.EVENT_EMITTER)
        .notify({ type: ActionType.winnerDetected, data: winnerData });
      const init = {
        headers: this.headers,
        method: method,
        body: JSON.stringify(winnerData),
      };
      await ApiService.getResponse(url, init);
    } catch (error) {
      console.error(error);
    }
  }

  public async getWinner(id: number): Promise<WinnerData | null> {
    try {
      const response = await ApiService.getResponseData(`${this.url}/${id}`);
      return isWinnerData(response.data) ? response.data : null;
    } catch (error) {
      if (
        error instanceof Response &&
        error.status === RESPONSE_STATUS.NOT_FOUND
      ) {
        return null;
      }
      throw error;
    }
  }

  public async getWinners(): Promise<WinnerData[]> {
    try {
      const response = await ApiService.getResponseData(this.url);
      if (!isWinnerArray(response.data)) {
        throw new Error("Invalid data");
      }
      return response.data;
    } catch (error) {
      if (error instanceof Response) {
        console.error(error.statusText);
      }
      throw error;
    }
  }
}
