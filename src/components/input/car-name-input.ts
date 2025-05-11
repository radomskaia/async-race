import { BaseInput } from "@/components/input/base-input.ts";
import {
  INPUT_NAMES,
  INPUT_TYPES,
  PLACEHOLDER,
} from "@/constants/input-constants.ts";
import carStyles from "@/components/cars/cars-list.module.css";

export class CarNameInput extends BaseInput {
  constructor(value?: string) {
    super(value);
    this.element.type = INPUT_TYPES.TEXT;
    this.addClassList([carStyles.carName]);
    this.element.placeholder = PLACEHOLDER;
    this.element.name = INPUT_NAMES.CAR_NAME;
    this.element.required = true;
  }
}
