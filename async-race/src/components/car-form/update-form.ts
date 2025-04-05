import { ApiService } from "@/services/api-service.ts";
import { BUTTON_TYPES } from "@/constants/buttons-constants.ts";
import type { Car, CarUpdateCallback } from "@/types";
import { FormButtonsConfig } from "@/types";
import type { BaseButton } from "@/components/buttons/base-button.ts";
import { BaseForm } from "@/components/car-form/base-form.ts";

export class UpdateForm extends BaseForm {
  private formButtons: BaseButton[] = [];
  private formButtonsConfig = FormButtonsConfig;
  constructor(
    value: Car,
    private callback: CarUpdateCallback,
  ) {
    super(value);
    this.callback = callback;
    this.addFormButtons();
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
      console.error(error);
      this.resetForm();
      return;
    }
    this.toggleUpdateState();
    ApiService.getInstance()
      .updateCar({ id, ...formData }, this.callback)
      .catch((error) => {
        console.error(error);
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
