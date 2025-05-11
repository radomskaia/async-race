import styles from "./button.module.css";

import { BaseButton } from "@/components/buttons/base-button.ts";
import { ATTRIBUTES } from "@/constants/constants.ts";
import type { ButtonOptions, Callback } from "@/types/button-types.ts";

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
        [ATTRIBUTES.ARIA_LABEL]: options.title,
      },
    });
    this.useSVGIcon = use;
    this.appendElement(svg);
  }
}
