import {
  ANIMATE_FILL_MODE,
  SUFFIXES,
  SYMBOLS,
  TRANSFORM_TYPE,
  ZERO,
} from "@/constants/constants.ts";
import type { Callback } from "@/types";

export class AnimateCar {
  private animation: Animation | null = null;
  private isAnimating = false;
  constructor(private car: SVGElement) {}

  public animate(distance: number, duration: number): void {
    this.isAnimating = true;
    this.animation = this.car.animate(
      [
        {
          transform: `${TRANSFORM_TYPE}${SYMBOLS.BRACKET.OPEN}${ZERO}${SUFFIXES.PIXELS}${SYMBOLS.BRACKET.CLOSE}`,
        },
        {
          transform: `${TRANSFORM_TYPE}${SYMBOLS.BRACKET.OPEN}${distance}${SUFFIXES.PIXELS}${SYMBOLS.BRACKET.CLOSE}`,
        },
      ],
      {
        duration: duration,
        fill: ANIMATE_FILL_MODE,
      },
    );
  }

  public pause(): void {
    this.animation?.pause();
  }

  public stop(): void {
    this.isAnimating = false;
    this.animation?.cancel();
  }

  public async reverse(rate: number, callback?: Callback): Promise<void> {
    if (!this.animation || !this.isAnimating) {
      return;
    }
    this.animation.updatePlaybackRate(rate);
    this.animation.reverse();
    this.animation.onfinish = (): void => {
      this.onfinish(callback);
    };
  }

  private onfinish(callback?: Callback): void {
    this.animation?.reverse();
    this.stop();
    if (callback) {
      callback();
    }
  }
}
