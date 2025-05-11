export type Callback = (data?: unknown) => void | Promise<void>;

export interface ButtonOptions {
  title: string;
  path?: string;
  classList?: string[];
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
