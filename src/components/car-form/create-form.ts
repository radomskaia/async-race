import { BaseForm } from "@/components/car-form/base-form.ts";
import { errorHandler, getRandomHEX } from "@/utilities/utilities.ts";
import { FormButtonsConfig } from "@/types/button-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { StorageKeys } from "@/types/session-storage-types.ts";

export class CreateForm extends BaseForm {
  constructor() {
    super();
    this.addFormButton();
    const storage = DIContainer.getInstance().getService(ServiceName.STORAGE);
    window.addEventListener("beforeunload", () => {
      storage.save(StorageKeys.carProperties, this.getFormData());
    });
    this.registerEvent(ActionType.changeRoute, () => {
      storage.save(StorageKeys.carProperties, this.getFormData());
    });
  }

  protected formHandler(event: Event): void {
    event.preventDefault();
    let formData;
    try {
      formData = this.getFormData();
    } catch (error) {
      errorHandler(error);
      return;
    }

    this.apiService
      .createCar(formData)
      .then(() => {
        this.nameElement.resetValue();
        this.colorElement.value = getRandomHEX();
        DIContainer.getInstance()
          .getService(ServiceName.EVENT_EMITTER)
          .notify({ type: ActionType.listUpdated, data: [null, true] });
      })
      .catch(errorHandler);
  }

  private addFormButton(): void {
    const confirmButton = BaseForm.createButton(FormButtonsConfig.CONFIRM);
    this.appendElement(confirmButton.getElement());
    confirmButton.addRaceListeners();
  }
}
