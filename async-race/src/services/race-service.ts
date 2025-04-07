import { AnimateCar } from "@/components/options/animate-car.ts";
import { MS_IS_SECOND, ONE, TWO, ZERO } from "@/constants/constants.ts";
import type {
  AnimationData,
  RaceData,
  RaceServiceInterface,
} from "@/types/race-service-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import type { Callback } from "@/types";

export class RaceService implements RaceServiceInterface {
  public name: ServiceName = ServiceName.RACE;
  private diContainer = DIContainer.getInstance();
  private engineService = this.diContainer.getService(ServiceName.ENGINE);
  private eventEmitter = this.diContainer.getService(ServiceName.EVENT_EMITTER);
  private cars: Record<number, AnimationData> = {};
  private distance = ZERO;
  private container: HTMLElement | null = null;
  private raceStack: number[] = [];
  private isAnimating = false;
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
    void this.engineService.stop(id);
    const car = this.cars[id];
    const index = this.raceStack.indexOf(id);
    if (index >= ZERO) {
      this.raceStack.splice(index, ONE);
    }
    const rate = (car.duration * TWO) / MS_IS_SECOND;
    let callback: Callback | undefined;
    if (this.isAnimating) {
      callback = (): void => {
        this.abortControllers.get(id)?.abort("Race stopped by user");
      };
    }

    this.distance = ZERO;
    car.animation?.reverse(rate, callback);
    if (this.raceStack.length === ZERO && !isRace) {
      this.eventEmitter.notify({ type: ActionType.raceEnded });
      this.isAnimating = false;
    }
  }

  public async startRace(): Promise<void> {
    this.isAnimating = true;
    this.abortControllers.clear();
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
    let winnerId;
    try {
      winnerId = await Promise.any(drivePromises);
    } catch {
      return;
    }
    if (!winnerId) {
      return;
    }
    this.isAnimating = false;

    if (this.raceStack.length > ONE) {
      void this.diContainer.getService(ServiceName.WINNER).create({
        id: winnerId,
        wins: ONE,
        time: this.cars[winnerId].duration / MS_IS_SECOND,
      });
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
      console.info(error);
    }
    this.eventEmitter.notify({ type: ActionType.raceEnded });
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
