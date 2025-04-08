import { BaseComponent } from "@/components/base-component.js";
import utilitiesStyles from "@/styles/utilities.module.css";
import { WinnerPagination } from "@/components/pagination/winner-pagination.ts";
import styles from "@/pages/winners/winners.module.css";
import type { FullData } from "@/types/api-service-types.ts";
import { Order, Sort } from "@/types/api-service-types.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import { isBoolean, isFullData, isSort } from "@/services/validator.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { StorageKeys } from "@/types/session-storage-types.ts";
import { TWO } from "@/constants/constants.ts";
import carStyles from "@/components/cars/cars-list.module.css";
import { ActionType } from "@/types/event-emitter-types.ts";

export class Winners extends BaseComponent<"div"> {
  private pagination;
  private isASC = false;
  private order;
  private sort;
  private tableWrapper = this.createDOMElement({
    tagName: "div",
  });

  constructor() {
    super();
    const storage = DIContainer.getInstance().getService(ServiceName.STORAGE);
    this.isASC = storage.load(StorageKeys.isASC, isBoolean) || false;
    this.order = this.isASC ? Order.ASC : Order.DESC;
    this.sort = storage.load(StorageKeys.sort, isSort) || Sort.ID;

    this.pagination = new WinnerPagination(this.order, this.sort);
    this.appendElement(this.pagination.getElement());
    this.appendElement(this.createUIPanel());

    this.appendElement(this.tableWrapper);
    window.addEventListener("beforeunload", () => {
      storage.save(StorageKeys.isASC, this.isASC);
      storage.save(StorageKeys.sort, this.sort);
    });

    this.registerEvent(ActionType.paginationUpdated, (data) => {
      if (isFullData(data)) {
        this.tableWrapper.replaceChildren();
        this.createWinnerTable(data);
      }
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

  private createWinnerTable(data: FullData[]): HTMLTableElement {
    const table = this.createDOMElement({
      tagName: "table",
    });

    this.tableWrapper.append(table);
    table.append(this.createTh());

    for (const fullData of data.values()) {
      table.append(this.createTr(fullData));
    }
    return table;
  }

  private createTh(): HTMLTableRowElement {
    const tr = this.createDOMElement({
      tagName: "tr",
    });
    const thID = this.createDOMElement({
      tagName: "th",
      textContent: "ID",
    });
    const thCar = this.createDOMElement({
      tagName: "th",
      textContent: "Car",
    });
    const thName = this.createDOMElement({
      tagName: "th",
      textContent: "Name",
    });
    const thWins = this.createDOMElement({
      tagName: "th",
      textContent: "Wins",
    });
    const thTime = this.createDOMElement({
      tagName: "th",
      textContent: "Time",
    });
    tr.append(thID, thCar, thName, thWins, thTime);
    return tr;
  }

  private createTr({
    name,
    color,
    id,
    wins,
    time,
  }: FullData): HTMLTableRowElement {
    const tr = this.createDOMElement({
      tagName: "tr",
    });
    const thID = this.createDOMElement({
      tagName: "td",
      textContent: id.toString(),
    });
    const thCar = this.createDOMElement({
      tagName: "td",
    });
    const { use, svg } = this.createSVG({
      classList: [carStyles.carIcon],
      path: ICON_PATH.CAR,
    });
    use.setAttribute("fill", color);
    thCar.append(svg);
    const thName = this.createDOMElement({
      tagName: "td",
      textContent: name,
    });
    const thWins = this.createDOMElement({
      tagName: "td",
      textContent: wins.toString() + "x",
    });
    const thTime = this.createDOMElement({
      tagName: "td",
      textContent: time.toFixed(TWO) + "s",
    });
    tr.append(thID, thCar, thName, thWins, thTime);
    return tr;
  }
}
