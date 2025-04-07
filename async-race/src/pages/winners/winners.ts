import { BaseComponent } from "@/components/base-component.js";
// import { DIContainer } from "@/services/di-container.js";
// import { Pagination } from "@/components/pagination/pagination.js";
// import { ServiceName } from "@/types/di-container-types.ts";
import utilitiesStyles from "@/styles/utilities.module.css";

export class Winners extends BaseComponent<"div"> {
  // private pagination;
  // private winnerService;

  constructor() {
    super();
    console.log("Winners");
    // const diContainer = DIContainer.getInstance();
    // this.winnerService = diContainer.getService(ServiceName.WINNER);
    // this.pagination = new Pagination("Garage", this.winnerService.getPage, () =>
    //   console.log("Winners"),
    // );
    // this.appendElement(this.pagination.getElement());
  }

  protected createElement(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.container,
        utilitiesStyles.flex,
        utilitiesStyles.gap30,
        utilitiesStyles.flexColumn,
        utilitiesStyles.alignCenter,
      ],
    });
  }
}
