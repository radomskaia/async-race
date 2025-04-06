import { AnimateCar } from "@/components/options/animate-car.ts";
import { MS_IS_SECOND, ONE, ZERO } from "@/constants/constants.ts";
import { isRaceData } from "@/services/validator.ts";
import { EngineStatus } from "@/types/api-service-types.ts";
import type {
  AnimationData,
  RaceData,
  RaceServiceInterface,
} from "@/types/race-service-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";

export class RaceService implements RaceServiceInterface {
  public name: ServiceName = ServiceName.RACE;
  private requestEngine = DIContainer.getInstance().getService(ServiceName.API)
    .requestEngine;
  private cars: Record<number, AnimationData> = {};
  private distance = ZERO;
  private container: HTMLElement | null = null;

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
    await this.startEngine(id);
    void this.startAnimation(id);
  }

  public stopSingleRace(id: number): void {
    this.cars[id].animation?.stop();
    this.distance = ZERO;
    void this.requestEngine(EngineStatus.STOPPED, id);
  }

  public async startRace(): Promise<void> {
    const startPromises = [];
    for (const id in this.cars) {
      startPromises.push(this.startEngine(Number(id)));
    }
    await Promise.allSettled(startPromises);

    const drivePromises = [];
    for (const id in this.cars) {
      drivePromises.push(this.startAnimation(Number(id)));
    }

    const winnerId = await Promise.any(drivePromises);
    void DIContainer.getInstance()
      .getService(ServiceName.API)
      .addWinner({
        id: winnerId,
        wins: ONE,
        time: this.cars[winnerId].duration / MS_IS_SECOND,
      });
  }

  public async stopRace(): Promise<void> {
    for (const id in this.cars) {
      this.stopSingleRace(Number(id));
    }
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
      throw error;
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
