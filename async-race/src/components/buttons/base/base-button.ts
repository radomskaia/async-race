import styles from "./button.module.css";

import type { ButtonOptions, Callback } from "@/types";
import { BaseComponent } from "@/components/base-component.ts";

export class BaseButton extends BaseComponent<"button", ButtonOptions> {
  constructor(callback?: Callback) {
    super();
    if (callback) {
      this.addListener(callback);
    }
  }
  public disabledElement(isDisabled: boolean): void {
    this.element.disabled = isDisabled;
  }

  public addListener(callback: Callback): void {
    this.element.addEventListener("click", callback);
  }

  protected createView(): HTMLButtonElement {
    return this.createDOMElement({
      tagName: "button",
      classList: [styles.button],
    });
  }
}
