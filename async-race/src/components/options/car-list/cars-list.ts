import type { Car } from "@/types";
import { ControllsButtonConfig } from "@/types";
import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/options/cars-list.module.css";
import { CarItem } from "@/components/options/car-item/car-item.ts";
import { ApiHandler } from "@/services/api-handler.ts";
import utilitiesStyles from "@/styles/utilities.module.css";

export class CarsList extends BaseComponent<"ul"> {
  constructor(list: Car[]) {
    super();
    this.addCarsList(list);
  }

  private static deleteOption(id: number, carItem: CarItem): void {
    ApiHandler.getInstance()
      .deleteCar(id)
      .then(() => {
        carItem.getElement().remove();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public addCar(carData: Car): void {
    const carItem = new CarItem(carData);
    this.appendElement(carItem.getElement());

    carItem.addControlsListener(() => {
      CarsList.deleteOption(carData.id, carItem);
    }, ControllsButtonConfig.DELETE);
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

  private addCarsList(list: Car[]): void {
    for (const car of list) {
      this.addCar(car);
    }
  }
}
