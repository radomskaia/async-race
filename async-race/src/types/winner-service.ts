import type {
  GetWinnersHandler,
  WinnerData,
} from "@/types/api-service-types.ts";
import type { Injectable } from "@/types/di-container-types.ts";

export interface WinnerServiceInterface extends Injectable {
  getPage: GetWinnersHandler;

  create(data: WinnerData): Promise<void>;

  getWinner(id: number): Promise<WinnerData | null>;

  deleteWinner(id: number): Promise<void>;
}
