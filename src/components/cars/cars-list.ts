import type { AddCarsList, Car } from "@/types";
import { BaseComponent } from "@/components/base-component.ts";
import carStyles from "@/components/cars/cars-list.module.css";
import { CarItem } from "@/components/cars/car-item.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { TypeNames } from "@/types/validator-types.ts";

export class CarsList extends BaseComponent<"ul"> {
  private readonly raceService;
  constructor() {
    super();
    const diContainer = DIContainer.getInstance();
    this.raceService = diContainer.getService(ServiceName.RACE);
    this.raceService.init(this.element);
    const validator = diContainer.getService(ServiceName.VALIDATOR);
    this.registerEvent(ActionType.paginationUpdated, (data: unknown) => {
      if (validator.validate(TypeNames.carArray, data)) {
        this.addCarsList(data);
      }
    });
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
        carStyles.carsList,
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.gap20,
      ],
    });
  }
}
