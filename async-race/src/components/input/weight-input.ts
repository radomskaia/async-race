import { BaseInput } from "@/components/input/base-input.ts";
import { SYMBOLS, ZERO } from "@/constants/constants.ts";
import {
  INPUT_TYPES,
  PLACEHOLDER,
  WEIGHT_STEP,
} from "@/constants/input-constants.ts";

export class WeightInput extends BaseInput {
  constructor(value?: string) {
    super(value);
    this.element.placeholder = PLACEHOLDER.WEIGHT;
    this.element.type = INPUT_TYPES.NUMBER;
    this.element.step = WEIGHT_STEP;
    this.element.min = ZERO.toString();
    this.element.addEventListener("beforeinput", (event) => {
      if (event.data === SYMBOLS.dash) {
        event.preventDefault();
      }
    });
  }
}
