import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/options/cars-list.module.css";
import utilitiesStyles from "@/styles/utilities.module.css";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import type { Car, CarProperties } from "@/types";
import { CarNameInput } from "@/components/input/car-name-input.ts";
import { CarColorInput } from "@/components/input/car-color-input.ts";
import { INPUT_NAMES } from "@/constants/input-constants.ts";
import { MESSAGES } from "@/constants/constants.ts";
import { getRandomHEX } from "@/utilities/utilities.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import type { FormButtonsConfig } from "@/types/button-types.ts";

export abstract class BaseForm extends BaseComponent<"form", number> {
  protected readonly nameElement;
  protected colorElement;
  protected apiService = DIContainer.getInstance().getService(
    ServiceName.GARAGE,
  );
  protected constructor(value?: Car) {
    super(value?.id);
    this.nameElement = this.addCarName(value?.name);
    const color = value?.color ?? getRandomHEX();
    this.colorElement = new CarColorInput(color);
    this.appendElement(
      this.colorElement.getElement(),
      this.nameElement.getElement(),
    );
  }

  protected static createButton(buttonText: FormButtonsConfig): IconButton {
    return new IconButton({
      title: BUTTON_TEXT[buttonText],
      path: ICON_PATH[buttonText],
      classList: [styles.formButton],
    });
  }

  protected createElement(id: number): HTMLElementTagNameMap["form"] {
    const form = this.createDOMElement({
      tagName: "form",
      classList: [styles.form],
    });
    this.addClassList(
      [
        utilitiesStyles.flex,
        utilitiesStyles.gap10,
        utilitiesStyles.alignCenter,
      ],
      form,
    );
    form.addEventListener("submit", (event) => this.formHandler(event, id));
    return form;
  }

  protected getFormData(): CarProperties {
    const formData = new FormData(this.element);
    const name = formData.get(INPUT_NAMES.CAR_NAME);
    const color = formData.get(INPUT_NAMES.CAR_COLOR);
    if (typeof name !== "string" || typeof color !== "string") {
      throw new TypeError(MESSAGES.INVALID_FORM_DATA);
    }
    return { name, color };
  }

  private addCarName(value?: string): CarNameInput {
    const carNameInput = new CarNameInput(value);
    this.appendElement(carNameInput.getElement());
    return carNameInput;
  }

  protected abstract formHandler(event: SubmitEvent, id?: number): void;
}
