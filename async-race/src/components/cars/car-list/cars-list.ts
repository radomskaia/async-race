import type { AddCarsList, Car } from "@/types";
import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/cars/cars-list.module.css";
import { CarItem } from "@/components/cars/car-item/car-item.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";

export class CarsList extends BaseComponent<"ul"> {
  private readonly raceService;
  constructor() {
    super();
    this.raceService = DIContainer.getInstance().getService(ServiceName.RACE);
    this.raceService.init(this.element);
  }

  public addCar(carData: Car): void {
    const carItem = new CarItem(carData);
    this.appendElement(carItem.getElement());
    this.raceService.addCar(carData.id, carItem.getCarElement());
  }

  public addCarsList: AddCarsList = (list) => {
    this.clearElement();
    this.raceService?.resetCars();
    for (const car of list) {
      this.addCar(car);
    }
  };

  protected createElement(): HTMLElementTagNameMap["ul"] {
    return this.createDOMElement({
      tagName: "ul",
      classList: [
        styles.carsList,
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.gap20,
      ],
    });
  }
}
