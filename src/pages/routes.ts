import { Home } from "@/pages/home/home.ts";
import { NotFound } from "@/pages/not-found.ts";
import { Winners } from "@/pages/winners/winners.ts";
import type { ComponentConstructor } from "@/types/router-type.ts";
import { PAGE_PATH } from "@/constants/constants.ts";

export const appRoutes = new Map<string, ComponentConstructor>([
  [PAGE_PATH.HOME, Home],
  [PAGE_PATH.NOT_FOUND, NotFound],
  [PAGE_PATH.WINNERS, Winners],
]);
