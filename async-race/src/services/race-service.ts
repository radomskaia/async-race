import { AnimateCar } from "@/components/options/animate-car.ts";
import {
  MS_IS_SECOND,
  ONE,
  RESPONSE_STATUS,
  TWO,
  ZERO,
} from "@/constants/constants.ts";
import { isRaceData } from "@/services/validator.ts";
import { EngineStatus } from "@/types/api-service-types.ts";
import type {
  AnimationData,
  RaceData,
  RaceServiceInterface,
} from "@/types/race-service-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";

export class RaceService implements RaceServiceInterface {
  public name: ServiceName = ServiceName.RACE;
  private diContainer = DIContainer.getInstance();
  private requestEngine = this.diContainer.getService(ServiceName.API)
    .requestEngine;
  private eventEmitter = this.diContainer.getService(ServiceName.EVENT_EMITTER);
  private cars: Record<number, AnimationData> = {};
  private distance = ZERO;
  private container: HTMLElement | null = null;
  private raceStack: number[] = [];

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
    if (this.raceStack.length === ZERO) {
      this.eventEmitter.notify({
        type: ActionType.singleRaceStarted,
        data: id,
      });
    }
    this.raceStack.push(id);
    await this.startEngine(id);
    await this.startAnimation(id);
  }

  public async stopSingleRace(id: number, isRace = false): Promise<void> {
    const car = this.cars[id];
    const index = this.raceStack.indexOf(id);
    if (index >= ZERO) {
      this.raceStack.splice(index, ONE);
    }
    const rate = (car.duration * TWO) / MS_IS_SECOND;
    car.animation?.reverse(rate);
    this.distance = ZERO;
    void this.requestEngine(EngineStatus.STOPPED, id);
    if (this.raceStack.length === ZERO && !isRace) {
      this.eventEmitter.notify({ type: ActionType.raceEnded });
    }
  }

  public async startRace(): Promise<void> {
    this.eventEmitter.notify({ type: ActionType.raceStarted });

    const startPromises = [];
    for (const id in this.cars) {
      startPromises.push(this.startEngine(Number(id)));
      this.raceStack.push(Number(id));
    }

    await Promise.allSettled(startPromises);
    const drivePromises = [];
    for (const id in this.cars) {
      drivePromises.push(this.startAnimation(Number(id)));
    }
    const winnerId = await Promise.any(drivePromises);

    void this.diContainer.getService(ServiceName.WINNER).create({
      id: winnerId,
      wins: ONE,
      time: this.cars[winnerId].duration / MS_IS_SECOND,
    });
  }

  public async stopRace(): Promise<void> {
    const stopPromises = [];
    const raceStack = [...this.raceStack];
    for (const id of raceStack) {
      stopPromises.push(this.stopSingleRace(id, true));
    }

    await Promise.allSettled(stopPromises);
    this.eventEmitter.notify({ type: ActionType.raceEnded });
  }

  private async startEngine(id: number): Promise<void> {
    const data = await this.requestEngine(EngineStatus.STARTED, id);
    if (!isRaceData(data)) {
      throw new Error(`Invalid data: ${data}`);
    }
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
    } catch (error) {
      this.cars[id].animation?.pause();
      if (
        error instanceof Response &&
        error.status === RESPONSE_STATUS.INTERNAL_SERVER_ERROR
      ) {
        throw error;
      } else {
        console.error("Something went wrong");
      }
    }
    return id;
  }

  private async drive(id: number): Promise<void> {
    try {
      await this.requestEngine(EngineStatus.DRIVE, id);
    } catch (error) {
      if (error instanceof Response) {
        throw error;
      } else {
        console.error("Something went wrong");
      }
    }
  }
}
