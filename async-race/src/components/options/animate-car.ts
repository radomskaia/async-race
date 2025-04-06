import { ZERO } from "@/constants/constants.ts";

export class AnimateCar {
  private animation: Animation | null = null;
  private isReversed = false;
  private isAnimating = false;
  constructor(private car: SVGElement) {}

  public animate(distance: number, duration: number): void {
    this.isAnimating = true;
    this.animation = this.car.animate(
      [
        { transform: `translateX(${ZERO}px)` },
        { transform: `translateX(${distance}px)` },
      ],
      {
        duration: duration,
        fill: "forwards",
      },
    );
  }

  public pause(): void {
    this.animation?.pause();
  }

  public stop(): void {
    if (!this.isAnimating) {
      return;
    }
    this.isAnimating = false;
    this.animation?.cancel();
  }

  public reverse(rate: number): void {
    if (!this.animation || this.isReversed) {
      return;
    }
    if (!this.isReversed && !this.isAnimating) {
      return;
    }
    this.isReversed = true;
    this.animation.updatePlaybackRate(rate);
    this.animation.reverse();
    this.animation.onfinish = (): void => {
      this.isReversed = false;
      this.animation?.reverse();
      this.stop();
    };
  }
}
