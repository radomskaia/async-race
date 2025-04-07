import { BaseComponent } from "@/components/base-component.js";
import { DIContainer } from "@/services/di-container.js";
import { ServiceName } from "@/types/di-container-types.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { WinnerPagination } from "@/components/pagination/winner-pagination.ts";
import styles from "@/pages/winners/winners.module.css";
import { Order, Sort } from "@/types/api-service-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";

export class Winners extends BaseComponent<"div"> {
  private pagination;
  private eventEmitter;
  private options = {
    order: Order.DESC,
    sort: Sort.ID,
  };
  private isASC = false;

  constructor() {
    super();
    this.pagination = new WinnerPagination();
    this.appendElement(this.pagination.getElement());
    this.eventEmitter = DIContainer.getInstance().getService(
      ServiceName.EVENT_EMITTER,
    );
    this.appendElement(this.createUIPanel());
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

  private createOrderButton(): IconButton {
    const button = new IconButton(
      {
        title: BUTTON_TEXT.ORDER,
        path: ICON_PATH.ORDER,
        classList: [styles.orderIcon],
      },
      () => {
        this.isASC = !this.isASC;
        this.options.order = this.isASC ? Order.ASC : Order.DESC;
        this.notify({
          order: this.options.order,
        });
        console.log(this.isASC);
        button
          .getElement()
          .classList.toggle(styles.orderIconRotate, this.isASC);
      },
    );
    return button;
  }

  private createUIPanel(): HTMLDivElement {
    const uiPanel = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.gap20,
        utilitiesStyles.alignCenter,
        utilitiesStyles.widthFull,
      ],
    });

    uiPanel.append(
      this.createDropList(),
      this.createOrderButton().getElement(),
    );
    return uiPanel;
  }

  private createDropList(): HTMLSelectElement {
    const selectElement = this.createDOMElement({
      tagName: "select",
      classList: [styles.filter],
      attributes: {
        id: "filter",
      },
    });

    selectElement.addEventListener("change", () => {
      this.notify({
        sort: selectElement.value,
      });
    });

    for (const value of Object.values(Sort)) {
      const optionElement = this.createDOMElement({
        tagName: "option",
        textContent: value,
        attributes: {
          value: value,
        },
      });
      selectElement.append(optionElement);
    }

    return selectElement;
  }

  private notify(data: unknown): void {
    this.eventEmitter.notify({
      type: ActionType.filterUpdated,
      data: data,
    });
  }
}
