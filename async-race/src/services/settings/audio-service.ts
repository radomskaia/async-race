import type { ButtonSettings } from "@/components/buttons/settings/button-settings.ts";
import { SettingsAction } from "@/services/settings/settings-action.ts";
import { MESSAGES } from "@/constants/constants.ts";
import { LocalStorage } from "@/services/local-storage.ts";
import { StorageKeys } from "@/types";
import { isBoolean } from "@/services/validator.ts";

export class AudioService extends SettingsAction {
  private static instance: AudioService | undefined;
  protected isOff = false;
  // private audioElements: Record<AudioName, HTMLAudioElement> = {
  //   [AudioName.strike]: new Audio(audioStrike),
  //   [AudioName.end]: new Audio(audioEnd),
  // };
  constructor(audioButton: ButtonSettings) {
    super(audioButton);
    this.init();
    // this.audioElements[AudioName.end].volume = END_SOUND_VOLUME;
    window.addEventListener("beforeunload", () => {
      LocalStorage.getInstance().save(StorageKeys.soundSettings, this.isOff);
    });
  }

  public static getInstance(audioButton?: ButtonSettings): AudioService {
    if (!AudioService.instance) {
      if (!audioButton) {
        throw new Error(MESSAGES.NOT_INITIALIZED);
      }
      AudioService.instance = new AudioService(audioButton);
    }
    return AudioService.instance;
  }

  // public updateSettings(): void {
  //   for (const audio of Object.values(this.audioElements)) {
  //     audio.muted = this.isOff;
  //   }
  //   this.button.togglePath(this.isOff);
  // }

  // public onEnded(name: AudioName, callback: Callback): void {
  //   this.audioElements[name].addEventListener("ended", callback, {
  //     once: true,
  //   });
  // }
  //
  // public playAudio(name: AudioName): void {
  //   if (this.isOff) {
  //     return;
  //   }
  //   this.audioElements[name]
  //     .play()
  //     .catch((error: Error) => console.error(MESSAGES.PLAYBACK + name, error));
  // }
  //
  // public stopAudio(name: AudioName): void {
  //   if (this.isOff || this.audioElements[name].currentTime === ZERO) {
  //     return;
  //   }
  //   this.audioElements[name].pause();
  //   this.audioElements[name].currentTime = ZERO;
  // }

  public getButton(): ButtonSettings {
    return this.button;
  }

  public toggle(): void {
    this.isOff = !this.isOff;
    // this.updateSettings();
  }

  private init(): void {
    const lsData = LocalStorage.getInstance().load(
      StorageKeys.soundSettings,
      isBoolean,
    );
    if (lsData !== null) {
      this.isOff = lsData;
      // this.updateSettings();
    }
    // for (const audio of Object.values(this.audioElements)) {
    //   audio.load();
    // }
  }
}
