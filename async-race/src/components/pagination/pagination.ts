import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { BaseButton } from "@/components/buttons/base-button.ts";
import { type AddCarsList, type Callback } from "@/types";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import styles from "@/components/options/cars-list.module.css";
import { ELEMENTS_PER_PAGE, ONE, ZERO } from "@/constants/constants.ts";
import type { GetCarsHandler } from "@/types/api-service-types.ts";
import { PaginationButtonConfig } from "@/types/button-types.ts";

export class Pagination extends BaseComponent<"div"> {
  private buttons: Record<string, BaseButton> = {};
  private buttonsConfig: {
    name: PaginationButtonConfig;
    callback: Callback;
  }[] = [
    {
      name: PaginationButtonConfig.FIRST,
      callback: (): void => {
        this.setPage(ONE).catch(console.error);
      },
    },
    {
      name: PaginationButtonConfig.PREVIOUS,
      callback: (): void => {
        this.setPage(this.currentPage - ONE).catch(console.error);
      },
    },
    {
      name: PaginationButtonConfig.NEXT,
      callback: (): void => {
        this.setPage(this.currentPage + ONE).catch(console.error);
      },
    },
    {
      name: PaginationButtonConfig.LAST,
      callback: (): void => {
        this.setPage(this.lastPage).catch(console.error);
      },
    },
  ];
  private readonly currentPageElement: HTMLParagraphElement;
  private readonly elementsCountElement: HTMLSpanElement;
  private currentPage: number;
  private lastPage: number;
  private limit = ELEMENTS_PER_PAGE;

  constructor(
    pageName: string,
    private readonly apiHandler: GetCarsHandler,
    private callback: AddCarsList,
  ) {
    super();
    this.currentPage = ZERO;
    this.lastPage = ONE;
    this.elementsCountElement = this.createDOMElement({
      tagName: "span",
      textContent: String(ZERO),
    });
    this.currentPageElement = this.createDOMElement({
      tagName: "p",
    });
    this.addPagination();
    this.addPageName(pageName);
    this.setPage(ONE).catch(console.error);
  }

  public async setPage(
    newPage: number | null,
    isCreate?: boolean,
  ): Promise<void> {
    if (newPage === this.currentPage) {
      return;
    }
    this.currentPage = newPage ?? this.currentPage;
    this.setPageNumber();
    const carsData = await this.apiHandler(this.currentPage, this.limit);
    this.setElementsCount(carsData.count);
    if (carsData.data.length === ZERO && this.currentPage !== ONE) {
      await this.setPage(this.currentPage - ONE);
      return;
    }
    const oldLastPage = this.lastPage;
    this.setLastPage(carsData.count);
    this.updateButtonsState();
    if (isCreate && this.currentPage !== oldLastPage) {
      return;
    }
    this.callback(carsData.data);
  }

  protected createElement(): HTMLElementTagNameMap["div"] {
    return this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.gap30,
        utilitiesStyles.alignCenter,
        // utilitiesStyles.widthFull,
      ],
    });
  }

  private updateButtonsState(): void {
    const isFirstPage = this.currentPage === ONE;
    const isLastPage = this.currentPage === this.lastPage;

    this.buttons[PaginationButtonConfig.FIRST].disabledElement(isFirstPage);
    this.buttons[PaginationButtonConfig.PREVIOUS].disabledElement(isFirstPage);
    this.buttons[PaginationButtonConfig.NEXT].disabledElement(isLastPage);
    this.buttons[PaginationButtonConfig.LAST].disabledElement(isLastPage);
  }

  private setLastPage(elementsCount: number): void {
    this.lastPage = Math.ceil(elementsCount / this.limit);
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
