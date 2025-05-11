import { ButtonSettings } from "@/components/buttons/settings/button-settings.ts";
import { BUTTON_TITLE, ICON_PATH } from "@/constants/buttons-constants.ts";

export class ThemeButton extends ButtonSettings {
  protected readonly pathOn: string;
  protected readonly pathOff = ICON_PATH.THEME.OFF;
  protected readonly title: string;

  constructor() {
    const path = ICON_PATH.THEME.ON;
    const title = BUTTON_TITLE.THEME;
    super({
      path,
      title,
    });
    this.title = title;
    this.pathOn = path;
  }
}
