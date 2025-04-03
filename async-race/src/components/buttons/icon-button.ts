import styles from "./base/button.module.css";

import { BaseButton } from "@/components/buttons/base/base-button.ts";
import type { ButtonOptions, Callback } from "src/types";
import { ATTRIBUTES } from "@/constants/buttons-constants.ts";

export class IconButton extends BaseButton {
  protected useSVGIcon: SVGUseElement;

  constructor(options: Required<ButtonOptions>, callback?: Callback) {
    super(callback);
    this.element.title = options.title;
    this.useSVGIcon = this.createSVG({
      path: options.path,
      classList: [styles.iconButton, ...options.classList],
      attributes: {
        title: options.title,
        [ATTRIBUTES.ariaLabel]: options.title,
      },
    });
  }
}
