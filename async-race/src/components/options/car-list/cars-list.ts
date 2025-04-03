import type { AddCarsList, Car, SetPageCallback } from "@/types";
import { ControllsButtonConfig } from "@/types";
import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/options/cars-list.module.css";
import { CarItem } from "@/components/options/car-item/car-item.ts";
import { ApiHandler } from "@/services/api-handler.ts";
import utilitiesStyles from "@/styles/utilities.module.css";

export class CarsList extends BaseComponent<"ul"> {
  private deleteCallback: SetPageCallback | null = null;

  public addCar(carData: Car): void {
    const carItem = new CarItem(carData);
    this.appendElement(carItem.getElement());

    carItem.addControlsListener(() => {
      this.deleteOption(carData.id);
    }, ControllsButtonConfig.DELETE);
  }

  public addCarsList: AddCarsList = (list) => {
    this.clearElement();
    for (const car of list) {
      this.addCar(car);
    }
  };

  public addDeleteCallback(callback: SetPageCallback): void {
    this.deleteCallback = callback;
  }

  protected createElement(): HTMLElementTagNameMap["ul"] {
    return this.createDOMElement({
      tagName: "ul",
      classList: [
        styles.carsList,
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.gap30,
      ],
    });
  }

  private deleteOption(id: number): void {
    if (!this.deleteCallback) {
      return;
    }
    ApiHandler.getInstance()
      .deleteCar(id, this.deleteCallback)
      .catch((error) => {
        console.error(error);
      });
  }
}
