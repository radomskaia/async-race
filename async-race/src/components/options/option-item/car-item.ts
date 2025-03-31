import { BaseComponent } from "@/components/base-component.ts";
import type { BaseButton } from "@/components/buttons/base/base-button.ts";
import {
  BUTTON_TEXT,
  ICON_PATH,
  SVG_CONFIG,
} from "@/constants/buttons-constants.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import styles from "@/components/options/option.module.css";
import type { Callback, CarProperties } from "@/types";
import { TextButton } from "@/components/buttons/text-button.ts";

export class CarItem extends BaseComponent<"li"> {
  private deleteButton: BaseButton;
  private editButton: BaseButton;
  private nameElement: HTMLParagraphElement | null = null;
  private useElement: SVGUseElement | null = null;
  constructor(value: CarProperties) {
    super();
    this.createCarView(value);
    const buttonWrapper = this.createDOMElement({
      tagName: "div",
    });
    this.deleteButton = this.addDeleteButton();
    this.editButton = this.addEditButton();
    buttonWrapper.append(
      this.deleteButton.getElement(),
      this.editButton.getElement(),
    );
    this.element.append(buttonWrapper);
  }

  public addDeleteListener(callback: Callback): void {
    this.deleteButton.addListener(callback);
  }

  public addEditListener(callback: Callback): void {
    this.editButton.addListener(callback);
  }

  public updateCarView(
    value: CarProperties,
    elements?: { name: HTMLParagraphElement; use: SVGUseElement },
  ): void {
    const carName = elements?.name || this.nameElement;
    const carUse = elements?.use || this.useElement;
    if (!carName || !carUse) {
      return;
    }
    carName.textContent = value.name;
    carUse.setAttribute("fill", value.color);
  }

  protected createView(): HTMLElementTagNameMap["li"] {
    return this.createDOMElement({
      tagName: "li",
      classList: [styles.optionItem],
    });
  }

  private createCarView(carProperties: CarProperties): void {
    this.nameElement = this.createDOMElement({
      tagName: "p",
    });
    const svg = document.createElementNS(SVG_CONFIG.NAMESPACE_SVG, "svg");
    this.addAttributes({ role: "img" }, svg);
    const use = document.createElementNS(SVG_CONFIG.NAMESPACE_SVG, "use");
    this.useElement = use;
    use.setAttributeNS(
      SVG_CONFIG.NAMESPACE_XLINK,
      SVG_CONFIG.QUALIFIED_NAME,
      ICON_PATH.CAR,
    );
    svg.append(use);

    this.updateCarView(carProperties, {
      name: this.nameElement,
      use: this.useElement,
    });

    this.appendElement(this.nameElement, svg);
  }

  private addDeleteButton(): BaseButton {
    const button = new IconButton({
      title: BUTTON_TEXT.DELETE,
      path: ICON_PATH.DELETE,
    });
    button.getElement().classList.add(styles.button);
    button.addClassSVG(styles.icon);
    this.appendElement(button.getElement());
    return button;
  }

  private addEditButton(): BaseButton {
    const button = new TextButton(BUTTON_TEXT.EDIT);
    this.appendElement(button.getElement());
    return button;
  }
}
