import { ZERO } from "@/constants/constants.ts";

export class AnimateCar {
  private animation: Animation | null = null;
  constructor(private car: SVGElement) {}

  public animate(distance: number, duration: number): void {
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
    this.animation?.cancel();
  }
}
