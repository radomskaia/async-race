import { BUTTON_TYPES } from "@/constants/buttons-constants.ts";
import type { Car } from "@/types";
import type { BaseButton } from "@/components/buttons/base-button.ts";
import { BaseForm } from "@/components/car-form/base-form.ts";
import { FormButtonsConfig } from "@/types/button-types.ts";
import { errorHandler } from "@/utilities/utilities.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";

export class UpdateForm extends BaseForm {
  private formButtons: BaseButton[] = [];
  private formButtonsConfig = FormButtonsConfig;
  private eventEmitter = DIContainer.getInstance().getService(
    ServiceName.EVENT_EMITTER,
  );
  private readonly id;
  constructor(value: Car) {
    super(value);
    this.addFormButtons();
    this.id = value.id;
    this.colorElement.getElement().addEventListener("change", () => {
      this.eventEmitter.notify({
        type: ActionType.updateCar,
        data: {
          id: this.id,
          name: this.nameElement.value,
          color: this.colorElement.value,
        },
      });
    });
  }

  public editHandler(): void {
    if (this.getUpdateState()) {
      this.toggleUpdateState();
      this.nameElement.getElement().focus();
      this.colorElement.setDefaultValue();
      this.nameElement.setDefaultValue();
    }
  }

  protected formHandler(event: Event, id: number): void {
    event.preventDefault();
    let formData;
    try {
      formData = this.getFormData();
    } catch (error) {
      errorHandler(error);
      this.resetForm();
      return;
    }
    this.toggleUpdateState();
    this.apiService.updateCar({ id, ...formData }).catch((error) => {
      errorHandler(error);
      this.resetForm();
    });
  }

  private getUpdateState(): boolean {
    return this.nameElement.getElement().disabled;
  }

  private toggleUpdateState(): void {
    this.nameElement.toggleDisabled();
    this.colorElement.toggleDisabled();
    for (const button of this.formButtons) {
      button.toggleDisabled();
    }
  }

  private addFormButtons(): void {
    this.createFormButtons();
    const [closeButton, confirmButton] = this.formButtons;
    closeButton.addListener(() => {
      this.resetForm();
      this.toggleUpdateState();
    });
    this.appendElement(confirmButton.getElement(), closeButton.getElement());

    this.toggleUpdateState();
  }

  private resetForm(): void {
    this.colorElement.resetValue();
    this.nameElement.resetValue();
    this.eventEmitter.notify({
      type: ActionType.updateCar,
      data: {
        id: this.id,
        name: this.nameElement.value,
        color: this.colorElement.value,
      },
    });
  }

  private createFormButtons(): void {
    for (const buttonText of Object.values(this.formButtonsConfig)) {
      const button = BaseForm.createButton(buttonText);
      if (buttonText === FormButtonsConfig.CONFIRM) {
        button.getElement().type = BUTTON_TYPES.SUBMIT;
      }
      this.formButtons.push(button);
    }
  }
}
