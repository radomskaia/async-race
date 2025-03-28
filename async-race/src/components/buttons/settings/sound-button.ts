import { ButtonSettings } from "@/components/buttons/settings/button-settings.ts";
import { BUTTON_TITLE, ICON_PATH } from "@/constants/buttons-constants.ts";

export class SoundButton extends ButtonSettings {
  protected readonly pathOn: string;
  protected readonly pathOff = ICON_PATH.SOUND.OFF;
  protected readonly title: string;

  constructor() {
    const path = ICON_PATH.SOUND.ON;
    const title = BUTTON_TITLE.VOLUME;
    super({
      path,
      title,
    });
    this.title = title;
    this.pathOn = path;
  }
}
