import type {
  FullData,
  ResponseCarData,
  ResponseData,
  ResponseWinnerData,
  Sort,
  Winner,
} from "@/types/api-service-types.ts";
import type { Car, CarProperties, ModalData } from "@/types/index.ts";
import type { RaceData } from "@/types/race-service-types.ts";

export enum TypeNames {
  object = "object",
  string = "string",
  number = "number",
  positiveNumber = "positiveNumber",
  boolean = "boolean",
  responseCarData = "responseCarData",
  responseWinnerData = "responseWinnerData",
  responseData = "responseData",
  raceData = "raceData",
  carArray = "carArray",
  winnerArray = "winnerArray",
  car = "car",
  winner = "winner",
  carProperties = "carProperties",
  modalData = "modalData",
  sort = "sort",
  fullData = "fullData",
}

export interface TypesForValidator {
  [TypeNames.object]: object;
  [TypeNames.string]: string;
  [TypeNames.number]: number;
  [TypeNames.positiveNumber]: number;
  [TypeNames.boolean]: boolean;
  [TypeNames.responseCarData]: ResponseCarData;
  [TypeNames.responseWinnerData]: ResponseWinnerData;
  [TypeNames.responseData]: ResponseData;
  [TypeNames.raceData]: RaceData;
  [TypeNames.carArray]: Car[];
  [TypeNames.winnerArray]: Winner[];
  [TypeNames.car]: Car;
  [TypeNames.winner]: Winner;
  [TypeNames.carProperties]: CarProperties;
  [TypeNames.modalData]: ModalData;
  [TypeNames.sort]: Sort;
  [TypeNames.fullData]: FullData[];
}
