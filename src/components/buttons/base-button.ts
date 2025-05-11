import styles from "./button.module.css";

import { BaseComponent } from "@/components/base-component.ts";
import type { ButtonOptions, Callback } from "@/types/button-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { ZERO } from "@/constants/constants.ts";

export class BaseButton extends BaseComponent<"button", ButtonOptions> {
  private wasDisabled: {
    isDisabled: boolean;
    singleStack: boolean[];
  } = {
    isDisabled: false,
    singleStack: [],
  };
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

  protected createElement(): HTMLButtonElement {
    return this.createDOMElement({
      tagName: "button",
      classList: [styles.button],
    });
  }

  public addRaceListeners(id?: number, isSingle = false): void {
    if (isSingle) {
      this.registerEvent(ActionType.singleRaceStarted, (eventID) => {
        if (eventID !== id) {
          return;
        }
        this.wasDisabled.singleStack.push(true);
        this.wasDisabled.isDisabled = this.element.disabled;
        this.disabledElement(true);
      });

      this.registerEvent(ActionType.singleRaceEnded, (eventID) => {
        if (eventID !== id && this.wasDisabled) {
          return;
        }
        this.wasDisabled.singleStack.pop();
        this.disabledElement(false);
      });
    } else {
      this.registerEvent(ActionType.singleRaceStarted, () => {
        this.wasDisabled.isDisabled = this.element.disabled;
        this.disabledElement(true);
      });
    }

    this.registerEvent(ActionType.raceEnded, () => {
      if (
        this.wasDisabled.isDisabled &&
        this.wasDisabled.singleStack.length !== ZERO
      ) {
        return;
      }
      this.disabledElement(false);
    });

    this.registerEvent(ActionType.raceStarted, () => {
      this.wasDisabled.isDisabled = this.element.disabled;
      this.disabledElement(true);
    });
  }
}
