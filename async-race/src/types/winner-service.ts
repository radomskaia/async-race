import type { GetWinnersHandler, Winner } from "@/types/api-service-types.ts";
import type { Injectable } from "@/types/di-container-types.ts";

export interface WinnerServiceInterface extends Injectable {
  getPage: GetWinnersHandler;

  create(data: Winner): Promise<void>;

  getWinner(id: number): Promise<Winner | null>;

  deleteWinner(id: number): Promise<void>;
}
