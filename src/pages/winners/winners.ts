import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { WinnerPagination } from "@/components/pagination/winner-pagination.ts";
import styles from "@/pages/winners/winners.module.css";
import type { FullData } from "@/types/api-service-types.ts";
import { Order, Sort } from "@/types/api-service-types.ts";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { StorageKeys } from "@/types/session-storage-types.ts";
import {
  ATTRIBUTES,
  SUFFIXES,
  TWO,
  WINNERS_TABLE_HEADERS,
} from "@/constants/constants.ts";
import carStyles from "@/components/cars/cars-list.module.css";
import { ActionType } from "@/types/event-emitter-types.ts";
import { TypeNames } from "@/types/validator-types.ts";

export class Winners extends BaseComponent<"div"> {
  private pagination;
  private isASC = false;
  private readonly order;
  private sort;
  private tableWrapper = this.createDOMElement({
    tagName: "div",
  });
  private validator = DIContainer.getInstance().getService(
    ServiceName.VALIDATOR,
  );

  constructor() {
    super();
    const storage = DIContainer.getInstance().getService(ServiceName.STORAGE);
    this.isASC = storage.load(StorageKeys.isASC, TypeNames.boolean) || false;
    this.order = this.isASC ? Order.ASC : Order.DESC;
    this.sort = storage.load(StorageKeys.sort, TypeNames.sort) || Sort.ID;

    this.pagination = new WinnerPagination(this.order, this.sort);
    this.appendElement(this.pagination.getElement());
    this.appendElement(this.createUIPanel());

    this.appendElement(this.tableWrapper);
    window.addEventListener("beforeunload", () => {
      storage.save(StorageKeys.isASC, this.isASC);
      storage.save(StorageKeys.sort, this.sort);
    });
    this.registerEvent(ActionType.changeRoute, () => {
      storage.save(StorageKeys.isASC, this.isASC);
      storage.save(StorageKeys.sort, this.sort);
    });

    this.registerEvent(ActionType.paginationUpdated, (data) => {
      if (this.validator.validate(TypeNames.fullData, data)) {
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
    });
    selectElement.addEventListener("change", () => {
      if (this.validator.validate(TypeNames.sort, selectElement.value)) {
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
      classList: [styles.table, utilitiesStyles.widthFull],
    });

    this.tableWrapper.append(table);
    table.append(this.createTableHeader());

    for (const fullData of data.values()) {
      table.append(this.createTableRow(fullData));
    }
    return table;
  }

  private createTableHeader(): HTMLTableRowElement {
    const headers = WINNERS_TABLE_HEADERS;
    const tr = this.createDOMElement({
      tagName: "tr",
      classList: [styles.tableRow],
    });
    for (const header of headers) {
      const th = this.createDOMElement({
        tagName: "th",
        textContent: header,
        classList: [styles.tableHeader],
      });
      tr.append(th);
    }
    return tr;
  }

  private createTableRow({
    name,
    color,
    id,
    wins,
    time,
  }: FullData): HTMLTableRowElement {
    const tr = this.createDOMElement({
      tagName: "tr",
      classList: [styles.tableRow],
    });

    const rowData = [
      id.toString(),
      color,
      name,
      `${wins.toString()}${SUFFIXES.COUNT}`,
      `${time.toFixed(TWO)}${SUFFIXES.SECONDS}`,
    ];
    for (const data of rowData) {
      const td = this.createDOMElement({
        tagName: "td",
        classList: [styles.tableData],
      });
      if (data === color) {
        const { use, svg } = this.createSVG({
          classList: [carStyles.carIcon],
          path: ICON_PATH.CAR,
        });
        use.setAttribute(ATTRIBUTES.FILL, color);
        td.append(svg);
      } else {
        this.addTextContent(data, td);
      }
      tr.append(td);
    }

    return tr;
  }
}
