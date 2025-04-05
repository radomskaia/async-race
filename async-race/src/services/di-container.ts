import type {
  DIContainerInterface,
  ServiceMap,
  ServiceName,
  ServiceTypes,
} from "@/types/di-container-types.ts";

export class DIContainer implements DIContainerInterface {
  private static instance: DIContainer | undefined;
  private services: Map<string, ServiceTypes>;
  private factory: Map<string, new () => ServiceTypes>;
  private constructor() {
    this.services = new Map();
    this.factory = new Map();
  }
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  public register<T extends keyof ServiceMap>(
    name: ServiceName,
    service: new () => ServiceMap[T],
  ): void {
    this.factory.set(name, service);
  }

  public getService<T extends keyof ServiceMap>(
    name: ServiceName,
  ): ServiceMap[T] {
    let service = this.services.get(name);
    if (service) {
      return service;
    } else {
      const factoryService = this.factory.get(name);
      if (!factoryService) {
        throw new Error(`Service ${name} not found`);
      }
      service = new factoryService();
      this.services.set(name, service);
      return service;
    }
  }
}
