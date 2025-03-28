export type Callback = () => void;

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
