import {
  EMPTY_STRING,
  MESSAGES,
  PAGE_PATH,
  SYMBOLS,
} from "@/constants/constants.ts";
import type { Route, RouterInterface } from "@/types/router-type.ts";
export class Router implements RouterInterface {
  private routes: Route[] = [];
  private currentPath = EMPTY_STRING;
  constructor() {
    globalThis.addEventListener("hashchange", () => {
      this.routerChange();
    });
  }

  public addRoutes(routes: Route[]): void {
    this.routes = routes;
    this.routerChange();
  }

  public navigateTo(path: string): void {
    this.currentPath = path;
    this.clearPage();
    let route = this.findValidRoute(path);
    if (!route) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    globalThis.location.hash = route.path;
    document.body.append(route.component.getInstance().getElement());
  }

  public getCurrentRoute(): string {
    return this.currentPath;
  }

  private findValidRoute(path: string): Route | undefined {
    return (
      this.routes.find((route) => route.path === path) ||
      this.routes.find((route) => route.path === PAGE_PATH.NOT_FOUND)
    );
  }

  private clearPage(): void {
    if (!this.routes) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    for (const route of this.routes) {
      const element = route.component.getInstance().getElement();
      if (element.parentNode) {
        element.remove();
      }
    }
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
