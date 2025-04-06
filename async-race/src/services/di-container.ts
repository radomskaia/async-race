import type {
  DIContainerInterface,
  Injectable,
  ServiceMap,
  ServiceName,
} from "@/types/di-container-types.ts";

export class DIContainer implements DIContainerInterface {
  private static instance: DIContainer | undefined;
  private services: Map<string, Injectable>;
  private factory: Map<string, new () => Injectable>;
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

  private static isServiceType<T extends ServiceName>(
    name: T,
    service: Injectable,
  ): service is ServiceMap[T] {
    return service.name === name;
  }

  public register(name: ServiceName, service: new () => Injectable): void {
    this.factory.set(name, service);
  }

  public getService<T extends ServiceName>(name: T): ServiceMap[T] {
    let service = this.services.get(name);
    if (!service) {
      const factoryService = this.factory.get(name);
      if (!factoryService) {
        throw new Error(`Service ${name} not found`);
      }
      service = new factoryService();
      this.services.set(name, service);
    }
    if (!DIContainer.isServiceType(name, service)) {
      throw new Error(`Service ${name} is not a service`);
    }
    return service;
  }
}
