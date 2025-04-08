import type {
  Action,
  EventEmitterInterface,
  Observer,
  RegisterObserver,
} from "@/types/event-emitter-types.ts";
import { ONE, ZERO } from "@/constants/constants.ts";
import { ServiceName } from "@/types/di-container-types.ts";

export class EventEmitter implements EventEmitterInterface {
  public name = ServiceName.EVENT_EMITTER;
  private observers = new Map<string, Observer[]>();

  public subscribe: RegisterObserver = (eventType, observer) => {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, []);
    }
    const observers = this.observers.get(eventType);
    observers?.push(observer);
  };

  public unsubscribe: RegisterObserver = (eventType, observer) => {
    const observers = this.observers.get(eventType);
    if (observers) {
      const index = observers.indexOf(observer);
      if (index >= ZERO) {
        observers.splice(index, ONE);
      }
    }
  };

  public notify(event: Action): void {
    const observers = this.observers.get(event.type);
    if (observers) {
      for (const observer of observers) {
        observer.update(event);
      }
    }
  }

  // private showObservers(type: ActionType): void {
  //   console.log(type, this.observers.get(type));
  // }
}
