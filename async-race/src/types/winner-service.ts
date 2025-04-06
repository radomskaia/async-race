import type { WinnerData } from "@/types/api-service-types.ts";
import type { Injectable } from "@/types/di-container-types.ts";

export interface WinnerServiceInterface extends Injectable {
  create(data: WinnerData): Promise<void>;

  getWinner(id: number): Promise<WinnerData | null>;

  getWinners(): Promise<WinnerData[]>;

  delete(id: number): Promise<void>;
}
