import { PAGE_PATH } from "@/constants/constants.ts";
import { Home } from "@/pages/home/home.ts";
import { NotFound } from "@/pages/not-found.ts";
import type { Route } from "@/types";

export const appRoutes: Route[] = [
  {
    path: PAGE_PATH.HOME,
    component: Home,
  },
  {
    path: PAGE_PATH.NOT_FOUND,
    component: NotFound,
  },
];
