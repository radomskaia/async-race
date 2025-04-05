export type Callback = () => void;
export type CarUpdateCallback = (data: CarProperties) => void;
export type SetPageCallback = (
  newPage: number | null,
  isCreate?: boolean,
) => Promise<void>;

export type TypeGuard<T> = (value: unknown) => value is T;

interface Options {
  classList?: string[];
  attributes?: Record<string, string>;
}

export interface ElementOptions<T> extends Options {
  tagName: T;
  textContent?: string;
}

export interface ButtonOptions {
  title: string;
  path?: string;
  classList?: string[];
}

export interface CreateSVGIconOptions
  extends Required<Omit<ButtonOptions, "title">> {
  attributes?: Record<string, string>;
}

export enum StorageKeys {
  soundSettings = "soundSettings",
}

export interface Route {
  path: string;
  component: {
    getInstance(): {
      getElement(): HTMLElement;
    };
  };
}

export interface CarProperties {
  name: string;
  color: string;
}

export interface Car extends CarProperties {
  name: string;
  color: string;
  id: number;
}

export interface ResponseData {
  data: unknown;
  count: number;
}

export interface ResponseCarData extends ResponseData {
  data: Car[];
  count: number;
}

export enum ControlsButtonConfig {
  EDIT = "EDIT",
  DELETE = "DELETE",
  START_ENGINE = "START_ENGINE",
  STOP_ENGINE = "STOP_ENGINE",
}

export enum PaginationButtonConfig {
  NEXT = "NEXT",
  PREVIOUS = "PREVIOUS",
  FIRST = "FIRST",
  LAST = "LAST",
}

export enum FormButtonsConfig {
  CROSS = "CROSS",
  CONFIRM = "CONFIRM",
}

export enum RaceButtonConfig {
  START_RACE = "START_RACE",
  RESET = "RESET",
  GENERATE_CARS = "GENERATE_CARS",
}

export enum EngineStatus {
  STARTED = "started",
  STOPPED = "stopped",
  DRIVE = "drive",
}

export enum REQUEST_METHOD {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export interface driveStatus {
  success: boolean;
}

export type RequestEngine = (
  status: EngineStatus,
  carId: number,
) => Promise<unknown>;

export interface RaceData {
  velocity: number;
  distance: number;
}

export interface WinnerData {
  id: number;
  wins: number;
  time: number;
}

export type GetCarsHandler = (
  page: number,
  limit: number,
) => Promise<ResponseCarData>;
export type AddCarsList = (list: Car[]) => void;
