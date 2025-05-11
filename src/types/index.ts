import type { ButtonOptions } from "@/types/button-types.ts";

export type Callback = () => void;
export type SetPageCallback = (
  newPage: number | null,
  isCreate?: boolean,
) => Promise<void>;

interface Options {
  classList?: string[];
  attributes?: Record<string, string>;
}

export interface ElementOptions<T> extends Options {
  tagName: T;
  textContent?: string;
}

export interface CreateSVGIconOptions
  extends Required<Omit<ButtonOptions, "title">> {
  attributes?: Record<string, string>;
}

export interface CarProperties {
  name: string;
  color: string;
}

export interface Car extends CarProperties {
  id: number;
}

export type AddCarsList = (list: Car[]) => void;

export interface ModalData {
  time: number;
  name: string;
  id: number;
}
