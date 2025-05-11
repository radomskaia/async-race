import { AnimateCar } from "@/services/race/animate-car.ts";
import {
  ERROR_MESSAGES,
  MS_IS_SECOND,
  ONE,
  TWO,
  ZERO,
} from "@/constants/constants.ts";
import type { AnimationData, RaceData } from "@/types/race-service-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import type { Callback } from "@/types";
import { errorHandler } from "@/utilities/utilities.ts";

export class RaceService implements Injectable {
  public name: ServiceName = ServiceName.RACE;
  private diContainer = DIContainer.getInstance();
  private engineService = this.diContainer.getService(ServiceName.ENGINE);
  private eventEmitter = this.diContainer.getService(ServiceName.EVENT_EMITTER);
  private cars: Record<number, AnimationData> = {};
  private distance = ZERO;
  private container: HTMLElement | null = null;
  private raceStack: number[] = [];
  private abortControllers = new Map<number, AbortController>();

  private static calculateDuration(data: RaceData): number {
    return data.velocity > ZERO ? data.distance / data.velocity : ZERO;
  }

  public init(container: HTMLElement): void {
    this.container = container;
  }

  public addCar(id: number, element: SVGElement): void {
    this.cars[id] = {
      id,
      element,
      duration: ZERO,
    };
  }

  public resetCars(): void {
    this.distance = ZERO;
    this.cars = {};
  }

  public async startSingleRace(id: number): Promise<void> {
    this.eventEmitter.notify({
      type: ActionType.singleRaceStarted,
      data: id,
    });
    this.raceStack.push(id);
    await this.startEngine(id);
    await this.startAnimation(id);
  }

  public async stopSingleRace(id: number, isRace = false): Promise<void> {
    const car = this.cars[id];
    const rate = (car.duration * TWO) / MS_IS_SECOND;
    let callback: Callback | undefined;
    callback = (): void => {
      this.abortControllers.get(id)?.abort(ERROR_MESSAGES.RACE_STOPPED);
      this.abortControllers.delete(id);
    };
    car.animation?.reverse(rate, callback);

    await this.engineService.stop(id);
    car.animation?.stop();
    this.eventEmitter.notify({ type: ActionType.singleRaceEnded, data: id });
    const index = this.raceStack.indexOf(id);
    if (index >= ZERO) {
      this.raceStack.splice(index, ONE);
    }

    this.distance = ZERO;
    if (this.raceStack.length === ZERO && !isRace) {
      this.eventEmitter.notify({ type: ActionType.raceEnded });
    }
  }

  public async stopRace(): Promise<void> {
    const stopPromises = [];
    const raceStack = [...this.raceStack];

    for (const id of raceStack) {
      stopPromises.push(this.stopSingleRace(id, true));
    }

    try {
      await Promise.allSettled(stopPromises);
    } catch (error) {
      errorHandler(error);
    }
    this.eventEmitter.notify({ type: ActionType.raceEnded });
  }

  public async startRace(): Promise<void> {
    this.abortControllers.clear();
    const startPromises = [];
    const animationPromises = [];
    this.eventEmitter.notify({ type: ActionType.raceStarted });
    for (const id in this.cars) {
      const promise = this.startEngine(Number(id));
      startPromises.push(promise);
      animationPromises.push(
        promise.then(() => this.startAnimation(Number(id))),
      );
      this.raceStack.push(Number(id));
    }
    Promise.allSettled(startPromises).then(() => {
      this.eventEmitter.notify({ type: ActionType.enginesStarted });
    });

    const carCount = this.raceStack.length;
    let winnerId;
    try {
      winnerId = await Promise.any(animationPromises);
    } catch (error) {
      errorHandler(error);
    }

    if (!winnerId) {
      return;
    }

    if (carCount > ONE && this.abortControllers.size === carCount) {
      await this.diContainer.getService(ServiceName.WINNER).create({
        id: winnerId,
        wins: ONE,
        time: this.cars[winnerId].duration / MS_IS_SECOND,
      });
    }
  }

  private async startEngine(id: number): Promise<void> {
    const data = await this.engineService.start(id);
    this.cars[id].duration = RaceService.calculateDuration(data);
    if (this.distance === ZERO && this.container) {
      this.distance =
        this.container.clientWidth - this.cars[id].element.clientWidth;
    }
  }

  private async startAnimation(id: number): Promise<number> {
    const car = this.cars[id];
    if (!car.animation) {
      car.animation = new AnimateCar(car.element);
    }
    car.animation?.animate(this.distance, car.duration);
    try {
      await this.drive(id);
      return id;
    } catch (error) {
      this.cars[id].animation?.pause();
      throw error;
    }
  }

  private async drive(id: number): Promise<void> {
    const controller = new AbortController();
    this.abortControllers.set(id, controller);
    await this.engineService.drive(id, controller.signal);
  }
}
