import type { AddCarsList, Car, SetPageCallback } from "@/types";
import { ControlsButtonConfig } from "@/types";
import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/options/cars-list.module.css";
import { CarItem } from "@/components/options/car-item/car-item.ts";
import { ApiService } from "@/services/api-service.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { RaceService } from "@/services/race-servies.ts";

export class CarsList extends BaseComponent<"ul"> {
  private deleteCallback: SetPageCallback | null = null;
  private raceService: RaceService | null = null;
  private readonly apiService = ApiService.getInstance();
  public addCar(carData: Car): void {
    const carItem = new CarItem(carData);
    this.appendElement(carItem.getElement());
    this.raceService?.addCar(carData.id, carItem.getCarElement());
    carItem.addControlsListener(() => {
      this.deleteOption(carData.id);
    }, ControlsButtonConfig.DELETE);
    carItem.addControlsListener(async () => {
      this.raceService?.startSingleRace(carData.id);
    }, ControlsButtonConfig.START_ENGINE);
    carItem.addControlsListener(async () => {
      this.raceService?.stopSingleRace(carData.id);
    }, ControlsButtonConfig.STOP_ENGINE);
  }

  public addCarsList: AddCarsList = (list) => {
    this.clearElement();
    this.raceService?.resetCars();
    for (const car of list) {
      this.addCar(car);
    }
  };

  public init(callback: SetPageCallback, raceService: RaceService): void {
    this.deleteCallback = callback;
    this.raceService = raceService;
  }

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

  private deleteOption(id: number): void {
    if (!this.deleteCallback) {
      return;
    }
    this.apiService.deleteCar(id, this.deleteCallback).catch((error) => {
      console.error(error);
    });
  }
}
