import { BaseComponent } from "@/components/base-component.ts";
import type { BaseButton } from "@/components/buttons/base-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import styles from "@/components/options/cars-list.module.css";
import type { Callback, Car, CarProperties } from "@/types";
import { ControllsButtonConfig } from "@/types";
import utilitiesStyles from "@/styles/utilities.module.css";
import { UpdateForm } from "@/components/car-form/update-form.ts";

export class CarItem extends BaseComponent<"li"> {
  private controlsButtons: Record<string, BaseButton> = {};
  private controlsButtonConfig = ControllsButtonConfig;
  private readonly form: UpdateForm;
  private readonly useElement: SVGUseElement;

  constructor(value: Car) {
    super();
    this.form = new UpdateForm(value, this.updateCarView.bind(this));
    this.element.append(this.createCarPanel());
    this.useElement = this.createSVG({
      classList: [styles.carIcon],
      path: ICON_PATH.CAR,
    });
    this.updateCarView(value);
    this.addControlsListener(
      () => this.form.editHandler(),
      ControllsButtonConfig.EDIT,
    );
  }

  public addControlsListener(
    callback: Callback,
    buttonName: ControllsButtonConfig,
  ): void {
    this.controlsButtons[buttonName].addListener(callback);
  }

  public updateCarView(value: CarProperties): void {
    const carUse = this.useElement;
    if (!carUse) {
      return;
    }
    carUse.setAttribute("fill", value.color);
  }

  protected createElement(): HTMLElementTagNameMap["li"] {
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
      ],
    });
    carPanel.append(this.form.getElement(), this.addControlsButtons());
    return carPanel;
  }

  private addControlsButtons(): HTMLDivElement {
    const buttonWrapper = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.alignCenter,
        utilitiesStyles.gap10,
      ],
    });
    for (const buttonText of Object.values(this.controlsButtonConfig)) {
      const button = new IconButton({
        title: BUTTON_TEXT[buttonText],
        path: ICON_PATH[buttonText],
        classList: [styles.icon],
      });
      this.appendElement(button.getElement());
      this.controlsButtons[buttonText] = button;
      buttonWrapper.append(button.getElement());
    }
    return buttonWrapper;
  }
}
