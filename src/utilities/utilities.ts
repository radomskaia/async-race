import { COLOR, SYMBOLS, ZERO } from "@/constants/constants.ts";
import { CAR_BRANDS, CAR_MODELS } from "@/constants/cars-model.ts";

function getColorValue(): string {
  return Math.floor(Math.random() * COLOR.RANGE)
    .toString(COLOR.HEX_BASE)
    .padStart(COLOR.HEX_LENGTH, COLOR.ZERO_PAD);
}

export function getRandomHEX(): string {
  let hexString = `${SYMBOLS.HASH}`;
  for (let index = ZERO; index < COLOR.RGB.length; index++) {
    hexString += getColorValue();
  }
  return hexString;
}

export function getRandomCarName(): string {
  const carBrandIndex = Math.floor(
    Math.random() * Object.keys(CAR_MODELS).length,
  );
  const carBrand = CAR_BRANDS[carBrandIndex];
  const carModelIndex = Math.floor(Math.random() * CAR_MODELS[carBrand].length);
  const carModel = CAR_MODELS[carBrand][carModelIndex];
  return `${carBrand} ${carModel}`;
}

export function errorHandler(error: unknown): void {
  if (error instanceof Error) {
    console.warn(error.message);
    return;
  }
  if (error instanceof Response) {
    console.warn(error.statusText);
    return;
  }
  if (error instanceof DOMException) {
    console.info(error.message);
    return;
  }
  console.warn(error);
}
