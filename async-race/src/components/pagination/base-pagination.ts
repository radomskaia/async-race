import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { BaseButton } from "@/components/buttons/base-button.ts";
import { type Callback } from "@/types";
import { IconButton } from "@/components/buttons/icon-button.ts";
import { BUTTON_TEXT, ICON_PATH } from "@/constants/buttons-constants.ts";
import carStyles from "@/components/cars/cars-list.module.css";
import { ONE, SYMBOLS, ZERO } from "@/constants/constants.ts";
import { PaginationButtonConfig } from "@/types/button-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import type {
  ResponseCarData,
  ResponseWinnerData,
} from "@/types/api-service-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { errorHandler } from "@/utilities/utilities.ts";
import { TypeNames } from "@/types/validator-types.ts";
import type { EventEmitter } from "@/services/event-emitter.ts";
import type { WinnerService } from "@/services/api/winner-service.ts";
import type { GarageService } from "@/services/api/garage-service.ts";

export abstract class BasePagination<
  T extends WinnerService | GarageService,
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
        this.setPage(ONE).catch(errorHandler);
      },
    },
    {
      name: PaginationButtonConfig.PREVIOUS,
      callback: (): void => {
        let newPage = this.currentPage - ONE;
        newPage = newPage <= ZERO ? ONE : newPage;
        this.setPage(newPage).catch(errorHandler);
      },
    },
    {
      name: PaginationButtonConfig.NEXT,
      callback: (): void => {
        let newPage = this.currentPage + ONE;
        newPage = Math.min(newPage, this.lastPage);
        this.setPage(newPage).catch(errorHandler);
      },
    },
    {
      name: PaginationButtonConfig.LAST,
      callback: (): void => {
        this.setPage(this.lastPage).catch(errorHandler);
      },
    },
  ];
  private readonly currentPageElement: HTMLParagraphElement;
  private readonly counterElement: HTMLSpanElement;
  private lastPage: number;
  protected abstract limit: number;
  protected abstract eventEmitter: EventEmitter;
  protected abstract apiHandler: T;

  protected constructor(pageName: string) {
    super();
    const storage = DIContainer.getInstance().getService(ServiceName.STORAGE);

    const currentPage = Number(
      storage.load(pageName, TypeNames.positiveNumber),
    );
    this.currentPage = currentPage || ONE;

    window.addEventListener("beforeunload", () => {
      storage.save(pageName, this.currentPage);
    });
    this.registerEvent(ActionType.changeRoute, () => {
      storage.save(pageName, this.currentPage);
    });

    this.counterElement = this.createDOMElement({
      tagName: "span",
      textContent: String(ONE),
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
    this.currentPage = newPage || this.currentPage;
    this.setPageNumber();
    const data = await this.getPaginationData();
    this.setElementsCount(data.count);
    const oldLastPage = this.lastPage;
    this.setLastPage(data.count);
    if (this.currentPage > this.lastPage) {
      this.currentPage = this.lastPage + ONE;
    }
    if (data.data.length === ZERO && this.currentPage > ONE) {
      await this.setPage(this.currentPage - ONE);
      return;
    }
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
    this.lastPage = Math.ceil(elementsCount / this.limit) || ONE;
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
          classList: [carStyles.icon],
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
    const openBracket = document.createTextNode(SYMBOLS.BRACKET.OPEN);
    const closeBracket = document.createTextNode(SYMBOLS.BRACKET.CLOSE);
    pageNameElement.append(openBracket, this.counterElement, closeBracket);
    this.appendElement(pageNameElement);
  }

  protected abstract getPaginationData(): Promise<D>;
}
