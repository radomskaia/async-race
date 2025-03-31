import type { Car } from "@/types";
import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/options/option.module.css";
import { CarItem } from "@/components/options/option-item/car-item.ts";
import { ApiHandler } from "@/services/api-handler.ts";

export class carsList extends BaseComponent<"ul"> {
  constructor(list: Car[]) {
    super();
    this.addCarsList(list);
  }

  public addCar(carData: Car): void {
    const carItem = new CarItem(carData);
    this.appendElement(carItem.getElement());

    carItem.addDeleteListener(() => {
      this.deleteOption(carData.id, carItem);
    });
    carItem.addEditListener(() => {
      this.editOption(carData.id, carItem);
    });
  }

  protected createView(): HTMLElementTagNameMap["ul"] {
    return this.createDOMElement({
      tagName: "ul",
      classList: [styles.optionsList],
    });
  }

  private addCarsList(list: Car[]): void {
    for (const car of list) {
      this.addCar(car);
    }
  }

  private deleteOption(id: number, carItem: CarItem): void {
    ApiHandler.getInstance().deleteCar(id);
    carItem.getElement().remove();
  }

  private editOption(id: number, carItem: CarItem): void {
    ApiHandler.getInstance().updateCar({
      id,
      name: "newName",
      color: "#ffffff",
    });
    carItem.updateCarView({
      name: "newName",
      color: "#ffffff",
    });
  }
}
