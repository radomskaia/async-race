import { BaseComponent } from "@/components/base-component.ts";
import type { BaseButton } from "@/components/buttons/base/base-button.ts";
import {
  BUTTON_TEXT,
  ICON_PATH,
  SVG_CONFIG,
} from "@/constants/buttons-constants.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import styles from "@/components/options/option.module.css";
import type { Callback, Car } from "@/types";

export class CarItem extends BaseComponent<"li", Car> {
  private button: BaseButton;
  constructor(value?: Car) {
    super(value);

    const buttonWrapper = this.createDOMElement({
      tagName: "div",
    });
    this.button = this.addDeleteButton();
    buttonWrapper.append(this.button.getElement());
    this.element.append(buttonWrapper);
  }

  public addDeleteListener(callback: Callback): void {
    this.button.addListener(callback);
  }

  protected createView({ name, color }: Car): HTMLElementTagNameMap["li"] {
    const carRow = this.createDOMElement({
      tagName: "li",
      classList: [styles.optionItem],
    });
    const carName = this.createDOMElement({
      tagName: "p",
      textContent: name,
    });
    const svg = document.createElementNS(SVG_CONFIG.NAMESPACE_SVG, "svg");
    this.addAttributes({ role: "img" }, svg);
    const use = document.createElementNS(SVG_CONFIG.NAMESPACE_SVG, "use");
    use.setAttributeNS(
      SVG_CONFIG.NAMESPACE_XLINK,
      SVG_CONFIG.QUALIFIED_NAME,
      ICON_PATH.CAR,
    );
    use.setAttribute("fill", color);
    svg.append(use);

    carRow.append(carName, svg);
    return carRow;
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
}
