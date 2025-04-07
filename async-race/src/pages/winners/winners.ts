import { BaseComponent } from "@/components/base-component.js";
// import { DIContainer } from "@/services/di-container.js";
// import { Pagination } from "@/components/pagination/pagination.js";
// import { ServiceName } from "@/types/di-container-types.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { WinnerPagination } from "@/components/pagination/winner-pagination.ts";

export class Winners extends BaseComponent<"div"> {
  private pagination;

  constructor() {
    super();
    this.pagination = new WinnerPagination();
    this.appendElement(this.pagination.getElement());
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
