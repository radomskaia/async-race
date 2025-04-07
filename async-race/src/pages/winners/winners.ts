import { BaseComponent } from "@/components/base-component.js";
import utilitiesStyles from "@/styles/utilities.module.css";
import { WinnerPagination } from "@/components/pagination/winner-pagination.ts";
import styles from "@/pages/winners/winners.module.css";
import { Order, Sort } from "@/types/api-service-types.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import { isBoolean, isSort } from "@/services/validator.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { StorageKeys } from "@/types/session-storage-types.ts";

export class Winners extends BaseComponent<"div"> {
  private pagination;
  private isASC = false;
  private order;
  private sort;

  constructor() {
    super();
    const storage = DIContainer.getInstance().getService(ServiceName.STORAGE);
    this.isASC = storage.load(StorageKeys.isASC, isBoolean) || false;
    this.order = this.isASC ? Order.ASC : Order.DESC;
    this.sort = storage.load(StorageKeys.sort, isSort) || Sort.ID;

    this.pagination = new WinnerPagination(this.order, this.sort);
    this.appendElement(this.pagination.getElement());
    this.appendElement(this.createUIPanel());

    window.addEventListener("beforeunload", () => {
      storage.save(StorageKeys.isASC, this.isASC);
      storage.save(StorageKeys.sort, this.sort);
    });
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
        const order = this.isASC ? Order.ASC : Order.DESC;
        this.pagination.setOrder(order);
        button
          .getElement()
          .classList.toggle(styles.orderIconRotate, this.isASC);
      },
    );
    button.getElement().classList.toggle(styles.orderIconRotate, this.isASC);
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
      if (isSort(selectElement.value)) {
        this.sort = selectElement.value;
        this.pagination.setSort(this.sort);
      }
    });

    for (const value of Object.values(Sort)) {
      const optionElement = this.createDOMElement({
        tagName: "option",
        textContent: value,
        attributes: {
          value: value,
        },
      });
      if (value === this.sort) {
        optionElement.selected = true;
      }
      selectElement.append(optionElement);
    }

    return selectElement;
  }
}
