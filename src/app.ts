import { Header } from "@/components/header/header.ts";
import { appRoutes } from "@/pages/routes.ts";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { registerServices } from "@/services/services.ts";
import { DIContainer } from "@/services/di-container.ts";
import { WinnerModal } from "@/components/modal/winner-modal.ts";

export function app(): void {
  registerServices();

  const body = document.body;
  const header = new Header()
    .addSettingsButton(BUTTON_TEXT.THEME)
    .addPageButton(BUTTON_TEXT.TO_GARAGE)
    .addPageButton(BUTTON_TEXT.TO_WINNERS)
    .getElement();

  const main = document.createElement("main");
  body.append(header, main);

  DIContainer.getInstance()
    .getService(ServiceName.ROUTER)
    .setContainer(main)
    .addRoutes(appRoutes);
  WinnerModal.getInstance();
}
