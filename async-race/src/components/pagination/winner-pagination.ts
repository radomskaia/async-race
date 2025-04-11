import type { ResponseWinnerData } from "@/types/api-service-types.ts";
import type { Order, Sort } from "@/types/api-service-types.ts";
import { BasePagination } from "@/components/pagination/base-pagination.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { PAGE_NAME, WINNERS_PER_PAGE } from "@/constants/constants.ts";
import { errorHandler } from "@/utilities/utilities.ts";
import type { WinnerService } from "@/services/api/winner-service.ts";

export class WinnerPagination extends BasePagination<
  WinnerService,
  ResponseWinnerData
> {
  protected limit;
  protected order;
  protected sort;
  protected eventEmitter;
  protected apiHandler;
  constructor(order: Order, sort: Sort) {
    super(PAGE_NAME.WINNERS);
    const diContainer = DIContainer.getInstance();
    this.eventEmitter = diContainer.getService(ServiceName.EVENT_EMITTER);
    this.apiHandler = diContainer.getService(ServiceName.WINNER);
    this.limit = WINNERS_PER_PAGE;
    this.order = order;
    this.sort = sort;
    this.setPage(null).catch(errorHandler);
  }

  public setOrder(order: Order): void {
    this.order = order;
    this.setPage(null).catch(errorHandler);
  }

  public setSort(sort: Sort): void {
    this.sort = sort;
    this.setPage(null).catch(errorHandler);
  }

  protected getPaginationData(): Promise<ResponseWinnerData> {
    return this.apiHandler.getPage({
      page: this.currentPage,
      limit: this.limit,
      order: this.order,
      sort: this.sort,
    });
  }
}
