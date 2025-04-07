import { Header } from "@/components/header/header.ts";
import { appRoutes } from "@/pages/routes.ts";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { registerServices } from "@/services/services.ts";
import { DIContainer } from "@/services/di-container.ts";
import { WinnerModal } from "@/components/modal/winner-modal.ts";

registerServices();

const body = document.body;
const header = new Header()
  .addSettingsButton("theme")
  .addSettingsButton("sound")
  .addPageButton(BUTTON_TEXT.GARAGE)
  .addPageButton(BUTTON_TEXT.WINNERS)
  .getElement();

body.append(header);

DIContainer.getInstance().getService(ServiceName.ROUTER).addRoutes(appRoutes);
WinnerModal.getInstance();
