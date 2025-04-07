import { BaseInput } from "@/components/input/base-input.ts";
import { INPUT_NAMES, INPUT_TYPES } from "@/constants/input-constants.ts";
import styles from "@/components/cars/cars-list.module.css";

export class CarColorInput extends BaseInput {
  constructor(value?: string) {
    super(value);
    this.element.type = INPUT_TYPES.COLOR;
    this.addClassList([styles.carColor]);
    this.element.name = INPUT_NAMES.CAR_COLOR;
  }
}
