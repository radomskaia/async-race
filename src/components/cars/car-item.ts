import { BaseComponent } from "@/components/base-component.ts";
import type { BaseButton } from "@/components/buttons/base-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import carStyles from "@/components/cars/cars-list.module.css";
import type { Car, CarProperties } from "@/types";
import utilitiesStyles from "@/styles/utilities.module.css";
import { UpdateForm } from "@/components/car-form/update-form.ts";
import type { Callback } from "@/types/button-types.ts";
import { ControlsButtonConfig } from "@/types/button-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { errorHandler } from "@/utilities/utilities.ts";
import { ATTRIBUTES, ERROR_MESSAGES } from "@/constants/constants.ts";
import { TypeNames } from "@/types/validator-types.ts";

export class CarItem extends BaseComponent<"li"> {
  private controlsButtons: Record<string, BaseButton> = {};
  private readonly buttonsConfig: {
    title: ControlsButtonConfig;
    callback: Callback;
    action: (button: IconButton) => void;
  }[] = [
    {
      title: ControlsButtonConfig.DELETE,
      callback: async (): Promise<void> => {
        await this.garageService.deleteCar(this.id).catch(errorHandler);
        this.eventEmitter.notify({
          type: ActionType.listUpdated,
          data: [null],
        });
      },
      action: (button: IconButton): void => button.addRaceListeners(this.id),
    },
    {
      title: ControlsButtonConfig.EDIT,
      callback: (): void => {
        this.form.editHandler();
      },
      action: (button: IconButton): void => button.addRaceListeners(this.id),
    },
    {
      title: ControlsButtonConfig.START_ENGINE,
      callback: (): void => {
        this.raceService.startSingleRace(this.id).catch(errorHandler);
      },
      action: (button: IconButton): void => {
        button.addRaceListeners(this.id, true);
      },
    },
    {
      title: ControlsButtonConfig.STOP_ENGINE,
      callback: (): void => {
        this.raceService.stopSingleRace(this.id).catch(errorHandler);
      },
      action: (button: IconButton): void => this.registerStopButton(button),
    },
  ];
  private readonly form;
  private readonly useElement;
  private readonly carElement;
  private readonly garageService;
  private readonly raceService;
  private readonly eventEmitter;
  private readonly id;

  constructor(value: Car) {
    super();
    const diContainer = DIContainer.getInstance();
    const validator = diContainer.getService(ServiceName.VALIDATOR);
    this.registerEvent(ActionType.updateCar, (data) => {
      if (!validator.validate(TypeNames.car, data)) {
        throw new Error(ERROR_MESSAGES.INVALID_DATA);
      }
      if (data.id === value.id) {
        this.updateCarView(data);
      }
    });
    this.raceService = diContainer.getService(ServiceName.RACE);
    this.garageService = diContainer.getService(ServiceName.GARAGE);
    this.eventEmitter = diContainer.getService(ServiceName.EVENT_EMITTER);
    this.form = new UpdateForm(value);
    this.id = value.id;
    this.element.append(this.createCarPanel());
    const { use, svg } = this.createSVG({
      classList: [carStyles.carIcon],
      path: ICON_PATH.CAR,
    });
    this.useElement = use;
    this.carElement = svg;
    this.appendElement(this.carElement);

    this.updateCarView(value);
  }

  public getCarElement(): SVGElement {
    return this.carElement;
  }

  public updateCarView(value: CarProperties): void {
    const carUse = this.useElement;
    if (!carUse) {
      return;
    }
    carUse.setAttribute(ATTRIBUTES.FILL, value.color);
  }

  protected createElement(): HTMLLIElement {
    return this.createDOMElement({
      tagName: "li",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.gap10,
      ],
    });
  }

  private createCarPanel(): HTMLDivElement {
    const carPanel = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.justifyBetween,
        utilitiesStyles.alignCenter,
        carStyles.carPanel,
      ],
    });
    carPanel.append(this.form.getElement(), this.addControlsButtons());
    return carPanel;
  }

  private createButtonWrapper(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.alignCenter,
        utilitiesStyles.gap10,
      ],
    });
  }

  private addControlsButtons(): HTMLDivElement {
    const buttonWrapper = this.createButtonWrapper();
    for (const { title, callback, action } of this.buttonsConfig) {
      const button = new IconButton(
        {
          title: BUTTON_TEXT[title],
          path: ICON_PATH[title],
          classList: [carStyles.icon],
        },
        callback,
      );
      this.appendElement(button.getElement());
      this.controlsButtons[title] = button;
      buttonWrapper.append(button.getElement());
      action(button);
    }
    return buttonWrapper;
  }

  private registerStopButton(button: IconButton): void {
    button.registerEvent(ActionType.singleRaceStarted, (eventID) => {
      if (eventID === this.id) {
        button.disabledElement(false);
      }
    });

    button.registerEvent(ActionType.raceEnded, () => {
      button.disabledElement(true);
    });
    button.registerEvent(ActionType.singleRaceEnded, (eventID) => {
      if (eventID === this.id) {
        button.disabledElement(true);
      }
    });
    button.addListener(() => button.disabledElement(true));
    button.disabledElement(true);
  }
}
