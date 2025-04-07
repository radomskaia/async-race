import type { Injectable } from "@/types/di-container-types.ts";
import type { BaseComponent } from "@/components/base-component.ts";

export type ComponentConstructor = new () => BaseComponent<"div">;
export type Route = Map<string, ComponentConstructor>;

export interface RouterInterface extends Injectable {
  addRoutes(routes: Route): void;
  navigateTo(path: string): void;
  getCurrentRoute(): string;
  setContainer(container: HTMLElement): this;
}
