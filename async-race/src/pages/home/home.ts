import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { Callback } from "@/types";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";
import styles from "@/pages/home/home.module.css";
import { TextButton } from "@/components/buttons/text-button.ts";
import { CarsList } from "@/components/options/car-list/cars-list.ts";
import { ApiHandler } from "@/services/api-handler.ts";
import { CreateForm } from "@/components/car-form/create-form.ts";
import { ONE } from "@/constants/constants.ts";

export class Home extends BaseComponent<"main"> {
  private static instance: Home | undefined;
  private currentPage: number = ONE;
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
        throw new Error("NOT IMPLEMENTED");
      },
    },
  ];

  private constructor() {
    super();
    this.createButtonWrapper();
    const createForm = new CreateForm(this.addCars.bind(this));
    this.appendElement(createForm.getElement());
    this.addCars().catch(console.error);
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

  private async addCars(): Promise<void> {
    const carsData = await ApiHandler.getInstance().getCars(this.currentPage);
    const carsWrapper = new CarsList(carsData);
    this.element.append(carsWrapper.getElement());
  }

  private addButtons(buttonWrapper: HTMLDivElement): void {
    for (const { title, callback } of this.buttonsConfig) {
      const button = new TextButton(title, callback);
      buttonWrapper.append(button.getElement());
    }
  }

  private createButtonWrapper(): HTMLDivElement {
    const buttonWrapper = this.createDOMElement({
      tagName: "div",
      classList: [
        styles.buttonWrapper,
        utilitiesStyles.flex,
        utilitiesStyles.alignCenter,
        utilitiesStyles.justifyBetween,
      ],
    });
    this.addButtons(buttonWrapper);
    this.appendElement(buttonWrapper);
    return buttonWrapper;
  }
}
