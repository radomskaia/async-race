import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { Callback } from "@/types";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";
import styles from "@/pages/home/home.module.css";
import { TextButton } from "@/components/buttons/text-button.ts";
import { CarsList } from "@/components/options/car-list/cars-list.ts";
import { ApiHandler } from "@/services/api-handler.ts";
// import { CreateForm } from "@/components/car-form/create-form.ts";
// import { CARS_COUNT, ZERO } from "@/constants/constants.ts";
// import { getRandomCarName, getRandomHEX } from "@/utilities/utilities.ts";
import { Pagination } from "@/components/pagination/pagination.ts";

export class Home extends BaseComponent<"main"> {
  private static instance: Home | undefined;
  private readonly buttonsConfig: {
    title: (typeof BUTTON_TEXT)[keyof typeof BUTTON_TEXT];
    callback: Callback;
  }[] = [
    {
      title: BUTTON_TEXT.START_RACE,
      callback: (): void => {
        throw new Error("NOT IMPLEMENTED");
      },
    },
    {
      title: BUTTON_TEXT.RESET,
      callback: (): void => {
        throw new Error("NOT IMPLEMENTED");
      },
    },
    {
      title: BUTTON_TEXT.GENERATE_CARS,
      callback: (): void => {
        // for (let index = ZERO; index < CARS_COUNT; index++) {
        //   const name = getRandomCarName();
        //   const color = getRandomHEX();
        //   ApiHandler.getInstance()
        //     .createCar(
        //       {
        //         name,
        //         color,
        //       },
        //       this.addCars.bind(this),
        //     )
        //     .catch(console.error);
        // }
      },
    },
  ];
  private carsList: CarsList;
  private pagination: Pagination;
  private constructor() {
    super();
    this.carsList = new CarsList();
    this.pagination = new Pagination(
      "Garage",
      ApiHandler.getInstance().getCars,
      this.carsList.addCarsList,
    );
    this.appendElement(
      this.pagination.getElement(),
      this.createUIPanel(),
      this.carsList.getElement(),
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

  // private async addCars(): Promise<void> {
  //   // const carsData = await ApiHandler.getInstance().getCars(this.currentPage);
  //   this.pagination.setElementsCount(carsData.count);
  //   this.carsList.addCarsList(carsData.data);
  //
  // }

  private addButtons(buttonWrapper: HTMLDivElement): void {
    for (const { title, callback } of this.buttonsConfig) {
      const button = new TextButton(title, callback);
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
    // const createForm = new CreateForm(this.addCars.bind(this));
    uiPanel.append(/*createForm.getElement(),*/ this.createButtonWrapper());
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
}
