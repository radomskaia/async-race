import type { ResponseWinnerData } from "@/types/api-service-types.ts";
import { Order, Sort } from "@/types/api-service-types.ts";
import { BasePagination } from "@/components/pagination/base-pagination.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ONE, WINNERS_PER_PAGE } from "@/constants/constants.ts";
import type { WinnerServiceInterface } from "@/types/winner-service.ts";

export class WinnerPagination extends BasePagination<
  WinnerServiceInterface,
  ResponseWinnerData
> {
  protected limit;
  protected eventEmitter;
  protected apiHandler;
  constructor() {
    super("Winner");
    const diContainer = DIContainer.getInstance();
    this.eventEmitter = diContainer.getService(ServiceName.EVENT_EMITTER);
    this.apiHandler = diContainer.getService(ServiceName.WINNER);
    this.limit = WINNERS_PER_PAGE;

    this.setPage(ONE).catch(console.error);
  }

  protected getPaginationData(): Promise<ResponseWinnerData> {
    return this.apiHandler.getPage({
      page: this.currentPage,
      limit: this.limit,
      order: Order.ASC,
      sort: Sort.ID,
    });
  }
}
