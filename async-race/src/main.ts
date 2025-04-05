import { Header } from "@/components/header/header.ts";
import { Router } from "@/services/router.ts";
import { appRoutes } from "@/pages/routes.ts";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { RaceService } from "@/services/race-servies.ts";
import { ApiService } from "@/services/api-service.ts";

const diContainer = DIContainer.getInstance();
diContainer.register(ServiceName.ROUTER, Router);
diContainer.register(ServiceName.API, ApiService);
diContainer.register(ServiceName.RACE, RaceService);

const body = document.body;
const header = new Header()
  .addSettingsButton("theme")
  .addSettingsButton("sound")
  .addPageButton(BUTTON_TEXT.GARAGE)
  .addPageButton(BUTTON_TEXT.WINNERS)
  .getElement();

body.append(header);

diContainer
  .getService<ServiceName.ROUTER>(ServiceName.ROUTER)
  .addRoutes(appRoutes);
