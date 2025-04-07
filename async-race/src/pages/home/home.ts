import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { Callback } from "@/types";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import styles from "@/pages/home/home.module.css";
import { CarsList } from "@/components/cars/car-list/cars-list.ts";
import { CreateForm } from "@/components/car-form/create-form.ts";
import { CARS_COUNT, ZERO } from "@/constants/constants.ts";
import { getRandomCarName, getRandomHEX } from "@/utilities/utilities.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { RaceButtonConfig } from "@/types/button-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { GaragePagination } from "@/components/pagination/garage-pagination.ts";

export class Home extends BaseComponent<"div"> {
  private readonly buttonsConfig: {
    title: RaceButtonConfig;
    callback: Callback;
  }[] = [
    {
      title: RaceButtonConfig.START_RACE,
      callback: (): void => {
        void this.raceService.startRace();
      },
    },
    {
      title: RaceButtonConfig.RESET,
      callback: (): void => {
        void this.raceService.stopRace();
      },
    },
    {
      title: RaceButtonConfig.GENERATE_CARS,
      callback: (): void => {
        this.generateCars();
      },
    },
  ];
  private readonly garageService;
  private readonly pagination;
  private readonly raceService;
  constructor() {
    super();
    const carsList = new CarsList();
    const diContainer = DIContainer.getInstance();
    this.raceService = diContainer.getService(ServiceName.RACE);
    this.garageService = diContainer.getService(ServiceName.GARAGE);
    this.pagination = new GaragePagination();
    this.appendElement(
      this.pagination.getElement(),
      this.createUIPanel(),
      carsList.getElement(),
    );
  }

  protected createElement(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.container,
        utilitiesStyles.flex,
        utilitiesStyles.gap30,
        utilitiesStyles.flexColumn,
        utilitiesStyles.alignCenter,
      ],
    });
  }

  private addButtons(buttonWrapper: HTMLDivElement): void {
    for (const { title, callback } of this.buttonsConfig) {
      let button;
      button = new IconButton(
        {
          title: BUTTON_TEXT[title],
          path: ICON_PATH[title],
          classList: [],
        },
        callback,
      );
      if (title === RaceButtonConfig.RESET) {
        button.registerEvent(ActionType.raceStarted, () => {
          button.disabledElement(false);
        });
        button.registerEvent(ActionType.singleRaceStarted, () => {
          button.disabledElement(false);
        });
        button.registerEvent(ActionType.raceEnded, () => {
          button.disabledElement(true);
        });
        button.disabledElement(true);
      } else {
        button.addRaceListeners();
      }

      buttonWrapper.append(button.getElement());
    }
  }

  private createUIPanel(): HTMLDivElement {
    const uiPanel = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.justifyBetween,
        utilitiesStyles.alignCenter,
        utilitiesStyles.widthFull,
      ],
    });
    const createForm = new CreateForm();
    uiPanel.append(createForm.getElement(), this.createButtonWrapper());
    return uiPanel;
  }

  private createButtonWrapper(): HTMLDivElement {
    const buttonWrapper = this.createDOMElement({
      tagName: "div",
      classList: [
        styles.buttonWrapper,
        utilitiesStyles.flex,
        utilitiesStyles.alignCenter,
        utilitiesStyles.gap20,
      ],
    });
    this.addButtons(buttonWrapper);
    return buttonWrapper;
  }

  private async generateCars(): Promise<void> {
    const requests: Promise<unknown>[] = [];
    for (let index = ZERO; index < CARS_COUNT; index++) {
      const name = getRandomCarName();
      const color = getRandomHEX();
      const request = this.garageService
        .createCar({
          name,
          color,
        })
        .catch(console.error);
      requests.push(request);
    }
    await Promise.all(requests);
    void this.pagination.setPage(null, true);
  }
}
