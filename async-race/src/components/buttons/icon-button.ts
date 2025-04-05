import styles from "./button.module.css";

import type { ButtonOptions, Callback } from "src/types";
import { BaseButton } from "@/components/buttons/base-button.ts";
import { ATTRIBUTES } from "@/constants/buttons-constants.ts";

export class IconButton extends BaseButton {
  protected useSVGIcon: SVGUseElement;

  constructor(options: Required<ButtonOptions>, callback?: Callback) {
    super(callback);
    this.element.title = options.title;
    const { use, svg } = this.createSVG({
      path: options.path,
      classList: [styles.iconButton, ...options.classList],
      attributes: {
        title: options.title,
        [ATTRIBUTES.ariaLabel]: options.title,
      },
    });
    this.useSVGIcon = use;
    this.appendElement(svg);
  }
}
