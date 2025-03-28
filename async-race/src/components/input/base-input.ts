import type { Callback } from "@/types";
import { BaseComponent } from "@/components/base-component.ts";

export class BaseInput extends BaseComponent<"input"> {
  constructor(value?: string) {
    super();
    if (value) {
      this.element.value = value;
    }
  }
  public get value(): string {
    return this.element.value;
  }

  public addListener(callback: Callback): void {
    this.element.addEventListener("change", callback);
  }

  protected createView(): HTMLInputElement {
    return this.createDOMElement({
      tagName: "input",
    });
  }
}
