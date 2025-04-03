import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { BaseButton } from "@/components/buttons/base-button.ts";
import {
  type AddCarsList,
  type Callback,
  type GetCarsHandler,
  PaginationButtonConfig,
} from "@/types";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import styles from "@/components/options/cars-list.module.css";
import { ELEMENTS_PER_PAGE, ONE } from "@/constants/constants.ts";

export class Pagination extends BaseComponent<"div"> {
  private buttons: Record<string, BaseButton> = {};
  private buttonsConfig: {
    name: PaginationButtonConfig;
    callback: Callback;
  }[] = [
    {
      name: PaginationButtonConfig.FIRST,
      callback: (): void => {
        this.currentPage = ONE;
        this.setPage().catch(console.error);
      },
    },
    {
      name: PaginationButtonConfig.PREVIOUS,
      callback: (): void => {
        this.currentPage = this.currentPage - ONE;
        this.setPage().catch(console.error);
      },
    },
    {
      name: PaginationButtonConfig.NEXT,
      callback: (): void => {
        this.currentPage = this.currentPage + ONE;
        this.setPage().catch(console.error);
      },
    },
    {
      name: PaginationButtonConfig.LAST,
      callback: (): void => {
        this.currentPage = this.totalPages;
        this.setPage().catch(console.error);
      },
    },
  ];
  private readonly currentPageElement: HTMLParagraphElement;
  private readonly elementsCountElement: HTMLSpanElement;
  private currentPage: number;
  private totalPages: number;
  private limit = ELEMENTS_PER_PAGE;
  constructor(
    pageName: string,
    private readonly apiHandler: GetCarsHandler,
    private callback: AddCarsList,
  ) {
    super();
    this.currentPage = ONE;
    this.totalPages = ONE;
    this.elementsCountElement = this.createDOMElement({
      tagName: "span",
    });
    this.currentPageElement = this.createDOMElement({
      tagName: "p",
    });
    this.addPagination();
    this.addPageName(pageName);
    this.setPage();
  }

  public async setPage(): Promise<void> {
    this.setPageNumber();
    const carsData = await this.apiHandler(this.currentPage, this.limit);
    this.callback(carsData.data);
    this.setElementsCount(carsData.count);
    this.setTotalPages(carsData.count);
    if (this.currentPage === ONE) {
      this.buttons[PaginationButtonConfig.FIRST].disabledElement(true);
      this.buttons[PaginationButtonConfig.PREVIOUS].disabledElement(true);
      this.buttons[PaginationButtonConfig.NEXT].disabledElement(false);
      this.buttons[PaginationButtonConfig.LAST].disabledElement(false);
    } else if (this.currentPage === this.totalPages) {
      this.buttons[PaginationButtonConfig.NEXT].disabledElement(true);
      this.buttons[PaginationButtonConfig.LAST].disabledElement(true);
      this.buttons[PaginationButtonConfig.FIRST].disabledElement(false);
      this.buttons[PaginationButtonConfig.PREVIOUS].disabledElement(false);
    } else {
      this.buttons[PaginationButtonConfig.NEXT].disabledElement(false);
      this.buttons[PaginationButtonConfig.LAST].disabledElement(false);
      this.buttons[PaginationButtonConfig.FIRST].disabledElement(false);
      this.buttons[PaginationButtonConfig.PREVIOUS].disabledElement(false);
    }
  }

  protected createElement(): HTMLElementTagNameMap["div"] {
    return this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.gap30,
        utilitiesStyles.alignCenter,
        utilitiesStyles.widthFull,
      ],
    });
  }

  private setTotalPages(elementsCount: number): void {
    this.totalPages = Math.ceil(elementsCount / this.limit);
  }

  private setPageNumber(): void {
    this.currentPageElement.textContent = String(this.currentPage);
  }

  private setElementsCount(elementsCount: number): void {
    this.elementsCountElement.textContent = String(elementsCount);
  }

  private addPagination(): void {
    const pagination = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.justifyBetween,
        utilitiesStyles.alignCenter,
      ],
    });
    this.createPaginationButtons();
    pagination.append(
      this.buttons[PaginationButtonConfig.FIRST].getElement(),
      this.buttons[PaginationButtonConfig.PREVIOUS].getElement(),
      this.currentPageElement,
      this.buttons[PaginationButtonConfig.NEXT].getElement(),
      this.buttons[PaginationButtonConfig.LAST].getElement(),
    );
    this.appendElement(pagination);
  }

  private createPaginationButtons(): void {
    for (const config of this.buttonsConfig) {
      this.buttons[config.name] = new IconButton(
        {
          title: BUTTON_TEXT[config.name],
          path: ICON_PATH[config.name],
          classList: [styles.icon],
        },
        config.callback,
      );
    }
  }

  private addPageName(pageName: string): void {
    const pageNameElement = this.createDOMElement({
      tagName: "p",
      textContent: pageName,
    });
    const openBracket = document.createTextNode("(");
    const closeBracket = document.createTextNode(")");
    pageNameElement.append(
      openBracket,
      this.elementsCountElement,
      closeBracket,
    );
    this.appendElement(pageNameElement);
  }
}
