import { BaseForm } from "@/components/car-form/base-form.ts";
import { getRandomHEX } from "@/utilities/utilities.ts";
import { FormButtonsConfig } from "@/types/button-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";

export class CreateForm extends BaseForm {
  constructor() {
    super();
    this.addFormButton();
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

    this.apiService
      .createCar(formData)
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.nameElement.resetValue();
        this.colorElement.value = getRandomHEX();
      });
    DIContainer.getInstance()
      .getService(ServiceName.EVENT_EMITTER)
      .notify({ type: ActionType.listUpdated, data: [null, true] });
  }

  private addFormButton(): void {
    const confirmButton = BaseForm.createButton(FormButtonsConfig.CONFIRM);
    this.appendElement(confirmButton.getElement());
    confirmButton.addRaceListeners();
  }
}
