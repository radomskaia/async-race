import {
  EMPTY_STRING,
  MESSAGES,
  PAGE_PATH,
  SYMBOLS,
} from "@/constants/constants.ts";
import { ServiceName } from "@/types/di-container-types";
import type { Route, RouterInterface } from "@/types/router-type.ts";

export class Router implements RouterInterface {
  public name: ServiceName = ServiceName.ROUTER;
  private routes: Route = new Map();
  private container: HTMLElement | null = null;

  private currentPath = EMPTY_STRING;

  constructor() {
    globalThis.addEventListener("hashchange", () => {
      this.routerChange();
    });
  }

  public setContainer(container: HTMLElement): this {
    this.container = container;
    return this;
  }

  public addRoutes(routes: Route): void {
    this.routes = routes;
    this.routerChange();
  }

  public navigateTo(path: string): void {
    this.currentPath = path;
    this.clearPage();
    let route = this.routes.get(path) ?? this.routes.get(PAGE_PATH.NOT_FOUND);
    if (!route) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    globalThis.location.hash = path;
    if (!this.container) {
      throw new Error("Container is not set");
    }
    this.container.append(new route().getElement());
  }

  public getCurrentRoute(): string {
    return this.currentPath;
  }

  private clearPage(): void {
    if (!this.container) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    this.container.replaceChildren();
  }

  private routerChange(): void {
    const hash: string =
      globalThis.location.hash.slice(SYMBOLS.hash.length) || PAGE_PATH.HOME;
    if (hash === this.currentPath) {
      return;
    }
    this.navigateTo(hash);
  }
}
