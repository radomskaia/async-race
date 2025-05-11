import type { ButtonSettings } from "@/components/buttons/settings/button-settings.ts";

export abstract class SettingsAction {
  protected abstract isOff: boolean;
  protected constructor(protected button: ButtonSettings) {
    this.button = button;
  }

  public abstract toggle(): void;
}
