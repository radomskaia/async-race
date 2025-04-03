export type Callback = () => void;
export type CarUpdateCallback = (data: CarProperties) => void;
export type CarCreateCallback = (data: Car) => void;

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
  data: Car[];
  count: number;
}

export enum ControllsButtonConfig {
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

export type GetCarsHandler = (
  page: number,
  limit: number,
) => Promise<ResponseData>;
export type AddCarsList = (list: Car[]) => void;
