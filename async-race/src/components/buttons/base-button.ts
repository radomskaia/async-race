import styles from "./button.module.css";

import { BaseComponent } from "@/components/base-component.ts";
import type { ButtonOptions, Callback } from "@/types/button-types.ts";

export class BaseButton extends BaseComponent<"button", ButtonOptions> {
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
}
