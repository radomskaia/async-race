import { BaseComponent } from "@/components/base-component.ts";
import { EMPTY_STRING } from "@/constants/constants.ts";

export class BaseInput extends BaseComponent<"input"> {
  private defaultValue = EMPTY_STRING;
  constructor(value?: string) {
    super();
    if (value) {
      this.element.value = value;
    }
  }

  public get value(): string {
    return this.element.value;
  }

  public set value(value: string) {
    this.element.value = value;
  }

  public setDefaultValue(): void {
    this.defaultValue = this.element.value;
  }

  public resetValue(): void {
    this.element.value = this.defaultValue;
  }

  public toggleDisabled(): void {
    this.element.disabled = !this.element.disabled;
  }

  protected createElement(): HTMLInputElement {
    return this.createDOMElement({
      tagName: "input",
    });
  }
}
