export type Callback = () => void;
export type CallbackEvent = (option?: Event) => void;

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
}

export interface CreateSVGIconOptions extends Options {
  path: string;
}

export enum InputType {
  Title = "title",
  Weight = "weight",
}

export enum StorageKeys {
  optionListValue = "optionListValue",
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

export interface Car {
  name: string;
  color: string;
  id: number;
}
