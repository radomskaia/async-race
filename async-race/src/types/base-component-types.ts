import type {
  Action,
  Observer,
  RegisterEvent,
} from "@/types/event-emitter-types.ts";
import type { CreateSVGIconOptions, ElementOptions } from "@/types/index.ts";

export interface BaseComponentInterface<T extends keyof HTMLElementTagNameMap>
  extends Observer {
  registerEvent: RegisterEvent;

  update(event: Action): void;

  getElement(): HTMLElementTagNameMap[T];

  appendElement(...child: Element[]): void;

  clearElement(): void;
}

export type CreateDOMElement = <T extends keyof HTMLElementTagNameMap>({
  tagName,
  classList,
  textContent,
  attributes,
}: ElementOptions<T>) => HTMLElementTagNameMap[T];

export type AddClassList = (classList: string[], element?: Element) => void;

export type AddAttributes = (
  attributes: Record<string, string>,
  element?: Element,
) => void;

export type AddTextContent = (textContent: string, element: Element) => void;

export type CreateSVG = ({
  path,
  classList,
  attributes,
}: CreateSVGIconOptions) => {
  use: SVGUseElement;
  svg: SVGElement;
};
