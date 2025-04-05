import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { Callback } from "@/types";
import { RaceButtonConfig } from "@/types";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import styles from "@/pages/home/home.module.css";
import { CarsList } from "@/components/options/car-list/cars-list.ts";
import { ApiHandler } from "@/services/api-handler.ts";
import { CreateForm } from "@/components/car-form/create-form.ts";
import { CARS_COUNT, ZERO } from "@/constants/constants.ts";
import { getRandomCarName, getRandomHEX } from "@/utilities/utilities.ts";
import { Pagination } from "@/components/pagination/pagination.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { RaceService } from "@/services/race-servies.ts";

export class Home extends BaseComponent<"main"> {
  private static instance: Home | undefined;
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
  private readonly pagination: Pagination;
  private readonly raceService: RaceService;
  private constructor() {
    super();
    const carsList = new CarsList();
    const carsListElement = carsList.getElement();

    this.raceService = new RaceService(carsListElement);

    this.pagination = new Pagination(
      "Garage",
      ApiHandler.getInstance().getCars,
      carsList.addCarsList,
    );
    carsList.init(
      this.pagination.setPage.bind(this.pagination),
      this.raceService,
    );
    this.appendElement(
      this.pagination.getElement(),
      this.createUIPanel(),
      carsListElement,
    );
  }

  public static getInstance(): Home {
    if (!Home.instance) {
      Home.instance = new Home();
    }
    return Home.instance;
  }

  protected createElement(): HTMLElement {
    return this.createDOMElement({
      tagName: "main",
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
    const createForm = new CreateForm(
      this.pagination.setPage.bind(this.pagination),
    );
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

  private generateCars(): void {
    const requests: Promise<void>[] = [];
    for (let index = ZERO; index < CARS_COUNT; index++) {
      const name = getRandomCarName();
      const color = getRandomHEX();
      const request = ApiHandler.getInstance()
        .createCar({
          name,
          color,
        })
        .catch(console.error);
      requests.push(request);
    }
    Promise.all(requests).then(() => {
      this.pagination.setPage(null, true).catch(console.error);
    });
  }
}
