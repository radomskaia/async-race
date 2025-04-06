import type { Injectable } from "@/types/di-container-types.ts";

export interface Route {
  path: string;
  component: {
    getInstance(): {
      getElement(): HTMLElement;
    };
  };
}

export interface RouterInterface extends Injectable {
  addRoutes(routes: Route[]): void;
  navigateTo(path: string): void;
  getCurrentRoute(): string;
}
