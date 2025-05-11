import { BaseComponent } from "@/components/base-component.ts";
import carStyles from "@/components/cars/cars-list.module.css";
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
import { StorageKeys } from "@/types/session-storage-types.ts";
import { TypeNames } from "@/types/validator-types.ts";

export abstract class BaseForm extends BaseComponent<"form", number> {
  protected readonly nameElement;
  protected colorElement;
  protected apiService = DIContainer.getInstance().getService(
    ServiceName.GARAGE,
  );
  protected validator = DIContainer.getInstance().getService(
    ServiceName.VALIDATOR,
  );
  protected constructor(value?: Car) {
    super(value?.id);
    const storage = DIContainer.getInstance().getService(ServiceName.STORAGE);

    const carProperties = storage.load(
      StorageKeys.carProperties,
      TypeNames.carProperties,
    );
    this.nameElement = this.addCarName(value?.name ?? carProperties?.name);
    const color = value?.color ?? carProperties?.color ?? getRandomHEX();
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
      classList: [carStyles.formButton],
    });
  }

  protected createElement(id: number): HTMLFormElement {
    const form = this.createDOMElement({
      tagName: "form",
      classList: [carStyles.form],
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
    if (
      !this.validator.validate(TypeNames.string, name) ||
      !this.validator.validate(TypeNames.string, color)
    ) {
      throw new TypeError(MESSAGES.INVALID_DATA);
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
