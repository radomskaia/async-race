import { BaseInput } from "@/components/input/base-input.ts";
import { INPUT_TYPES, PLACEHOLDER } from "@/constants/input-constants.ts";

export class TitleInput extends BaseInput {
  constructor(value?: string) {
    super(value);
    this.element.placeholder = PLACEHOLDER.TITLE;
    this.element.type = INPUT_TYPES.TEXT;
  }
}
