import { ApiService } from "@/services/api-service.ts";
import type { SetPageCallback } from "@/types";
import { FormButtonsConfig } from "@/types";
import { BaseForm } from "@/components/car-form/base-form.ts";
import { getRandomHEX } from "@/utilities/utilities.ts";

export class CreateForm extends BaseForm {
  constructor(private callback: SetPageCallback) {
    super();
    this.addFormButton();
    this.callback = callback;
  }

  protected formHandler(event: Event): void {
    event.preventDefault();
    let formData;
    try {
      formData = this.getFormData();
    } catch (error) {
      console.error(error);
      return;
    }

    ApiService.getInstance()
      .createCar(formData, this.callback)
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.nameElement.resetValue();
        this.colorElement.value = getRandomHEX();
      });
  }

  private addFormButton(): void {
    const confirmButton = BaseForm.createButton(FormButtonsConfig.CONFIRM);
    this.appendElement(confirmButton.getElement());
  }
}
