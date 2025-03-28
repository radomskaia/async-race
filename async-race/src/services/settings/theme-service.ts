import type { ButtonSettings } from "@/components/buttons/settings/button-settings.ts";
import { SettingsAction } from "@/services/settings/settings-action.ts";
import { MESSAGES } from "@/constants/constants.ts";
import {
  DARK_THEME_ATTRIBUTE,
  DARK_THEME_MEDIA_QUERY,
} from "@/constants/theme-constants.ts";

export class ThemeService extends SettingsAction {
  private static instance: ThemeService | undefined;
  protected isOff: boolean;
  private mediaQueryList: MediaQueryList;
  constructor(themeButton: ButtonSettings) {
    super(themeButton);
    this.mediaQueryList = globalThis.matchMedia(DARK_THEME_MEDIA_QUERY);
    this.isOff = this.mediaQueryList.matches;
    this.changeTheme(this.isOff);
    this.mediaQueryList.addEventListener("change", (event) => {
      this.changeTheme(event.matches);
    });
  }

  public static getInstance(audioButton?: ButtonSettings): ThemeService {
    if (!ThemeService.instance) {
      if (!audioButton) {
        throw new Error(MESSAGES.NOT_INITIALIZED);
      }
      ThemeService.instance = new ThemeService(audioButton);
    }
    return ThemeService.instance;
  }

  public toggle(): void {
    this.isOff = !this.isOff;
    this.changeTheme(this.isOff);
  }

  private changeTheme(isDark: boolean): void {
    this.button.togglePath(isDark);
    document.body.toggleAttribute(DARK_THEME_ATTRIBUTE, isDark);
  }
}
