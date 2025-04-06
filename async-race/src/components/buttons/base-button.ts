import styles from "./button.module.css";

import { BaseComponent } from "@/components/base-component.ts";
import type { ButtonOptions, Callback } from "@/types/button-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";

export class BaseButton extends BaseComponent<"button", ButtonOptions> {
  private wasDisabled = false;
  constructor(callback?: Callback) {
    super();
    if (callback) {
      this.addListener(callback);
    }
  }

  public toggleDisabled(): void {
    this.disabledElement(!this.element.disabled);
  }

  public disabledElement(isDisabled: boolean): void {
    this.element.disabled = isDisabled;
  }

  public addListener(callback: Callback): void {
    this.element.addEventListener("click", callback);
  }

  public addRaceListeners(id?: number, isSingle = false): void {
    this.registerEvent(ActionType.singleRaceStarted, (eventID) => {
      if (isSingle && id && eventID !== id) {
        return;
      }
      this.wasDisabled = this.element.disabled;
      this.disabledElement(true);
    });
    this.registerEvent(ActionType.raceEnded, () => {
      if (this.wasDisabled) {
        return;
      }
      this.disabledElement(false);
    });

    this.registerEvent(ActionType.raceStarted, () => {
      this.wasDisabled = this.element.disabled;
      this.disabledElement(true);
    });
  }

  protected createElement(): HTMLButtonElement {
    return this.createDOMElement({
      tagName: "button",
      classList: [styles.button],
    });
  }
}
