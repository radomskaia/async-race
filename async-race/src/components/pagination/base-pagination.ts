import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { BaseButton } from "@/components/buttons/base-button.ts";
import { type Callback } from "@/types";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import styles from "@/components/cars/cars-list.module.css";
import { ONE, ZERO } from "@/constants/constants.ts";
import { PaginationButtonConfig } from "@/types/button-types.ts";
import type { EventEmitterInterface } from "@/types/event-emitter-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import type {
  ResponseCarData,
  ResponseWinnerData,
} from "@/types/api-service-types.ts";
import type { WinnerServiceInterface } from "@/types/winner-service.ts";
import type { GarageServiceInterface } from "@/types/garage-service-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { isPositiveNumber } from "@/services/validator.ts";

export abstract class BasePagination<
  T extends WinnerServiceInterface | GarageServiceInterface,
  D extends ResponseWinnerData | ResponseCarData,
> extends BaseComponent<"div"> {
  protected currentPage: number;
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
  private readonly counterElement: HTMLSpanElement;
  private lastPage: number;
  protected abstract limit: number;
  protected abstract eventEmitter: EventEmitterInterface;
  protected abstract apiHandler: T;

  protected constructor(pageName: string) {
    super();
    const storage = DIContainer.getInstance().getService(ServiceName.STORAGE);

    const currentPage = Number(storage.load(pageName, isPositiveNumber));
    this.currentPage = currentPage ?? ONE;

    window.addEventListener("beforeunload", () => {
      storage.save(pageName, this.currentPage);
    });

    this.counterElement = this.createDOMElement({
      tagName: "span",
      textContent: String(ZERO),
    });
    this.currentPageElement = this.createDOMElement({
      tagName: "p",
    });
    this.addPagination();
    this.addPageName(pageName);
    this.lastPage = this.currentPage || ONE;
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
    const data = await this.getPaginationData();
    this.setElementsCount(data.count);
    if (data.data.length === ZERO && this.currentPage !== ONE) {
      await this.setPage(this.currentPage - ONE);
      return;
    }
    const oldLastPage = this.lastPage;
    this.setLastPage(data.count);
    this.updateButtonsState();
    if (isCreate && this.currentPage !== oldLastPage) {
      return;
    }
    this.eventEmitter.notify({
      type: ActionType.paginationUpdated,
      data: data.data,
    });
  }

  protected createElement(): HTMLElementTagNameMap["div"] {
    return this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.gap30,
        utilitiesStyles.alignCenter,
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
    this.counterElement.textContent = String(elementsCount);
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
      const button = new IconButton(
        {
          title: BUTTON_TEXT[config.name],
          path: ICON_PATH[config.name],
          classList: [styles.icon],
        },
        config.callback,
      );
      this.buttons[config.name] = button;
      button.addRaceListeners();
    }
  }

  private addPageName(pageName: string): void {
    const pageNameElement = this.createDOMElement({
      tagName: "p",
      textContent: pageName,
    });
    const openBracket = document.createTextNode("(");
    const closeBracket = document.createTextNode(")");
    pageNameElement.append(openBracket, this.counterElement, closeBracket);
    this.appendElement(pageNameElement);
  }

  protected abstract getPaginationData(): Promise<D>;
}
