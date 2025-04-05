export interface Route {
  path: string;
  component: {
    getInstance(): {
      getElement(): HTMLElement;
    };
  };
}

export interface RouterInterface {
  addRoutes(routes: Route[]): void;
  navigateTo(path: string): void;
  getCurrentRoute(): string;
}
