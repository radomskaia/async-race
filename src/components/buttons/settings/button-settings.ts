import styles from "@/components/buttons/button.module.css";
import type { SettingsAction } from "@/services/settings/settings-action.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { SVG_CONFIG } from "@/constants/buttons-constants.ts";
import type { ButtonOptions } from "@/types/button-types.ts";
import { ERROR_MESSAGES } from "@/constants/constants.ts";

export abstract class ButtonSettings extends IconButton {
  protected abstract pathOff: string;
  protected abstract pathOn: string;
  protected abstract title: string;

  protected constructor(options: ButtonOptions) {
    if (!options.path) {
      throw new Error(ERROR_MESSAGES.PATH_REQUIRED);
    }
    super({
      title: options.title,
      classList: options.classList ?? [],
      path: options.path,
    });
    this.addClassList([styles.settings]);
  }

  public togglePath(isOn: boolean): void {
    const path = isOn ? this.pathOff : this.pathOn;
    this.useSVGIcon.setAttributeNS(
      SVG_CONFIG.NAMESPACE_XLINK,
      SVG_CONFIG.QUALIFIED_NAME,
      path,
    );
  }

  public addToggleListener(action: SettingsAction): void {
    this.addListener(() => {
      action.toggle();
    });
  }
}
