import { Header } from "@/components/header/header.ts";
import { Router } from "@/services/router.ts";
import { appRoutes } from "@/pages/routes.ts";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";

const body = document.body;
const header = new Header()
  .addSettingsButton("theme")
  .addSettingsButton("sound")
  .addPageButton(BUTTON_TEXT.GARAGE)
  .addPageButton(BUTTON_TEXT.WINNERS)
  .getElement();

body.append(header);

Router.getInstance().addRoutes(appRoutes);
