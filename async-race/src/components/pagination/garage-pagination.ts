import type { ResponseCarData } from "@/types/api-service-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { BasePagination } from "@/components/pagination/base-pagination.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { CARS_PER_PAGE } from "@/constants/constants.ts";
import type { GarageServiceInterface } from "@/types/garage-service-types.ts";
import { errorHandler } from "@/utilities/utilities.ts";

export class GaragePagination extends BasePagination<
  GarageServiceInterface,
  ResponseCarData
> {
  protected limit;
  protected eventEmitter;
  protected apiHandler;
  constructor() {
    super("Garage");
    const diContainer = DIContainer.getInstance();
    this.eventEmitter = diContainer.getService(ServiceName.EVENT_EMITTER);
    this.apiHandler = diContainer.getService(ServiceName.GARAGE);
    this.limit = CARS_PER_PAGE;

    this.registerEvent(ActionType.listUpdated, async (data) => {
      if (!Array.isArray(data)) {
        return;
      }
      const [newPage, isCreate] = data;
      if (
        (typeof newPage === "number" || newPage === null) &&
        (typeof isCreate === "boolean" || isCreate === undefined)
      ) {
        await this.setPage(newPage, isCreate).catch(errorHandler);
      }
    });

    this.setPage(null).catch(errorHandler);
  }

  protected async getPaginationData(): Promise<ResponseCarData> {
    let data;
    try {
      data = await this.apiHandler.getPage({
        page: this.currentPage,
        limit: this.limit,
      });
    } catch (error) {
      errorHandler(error);
    }
    if (!data) {
      throw new Error("Invalid data");
    }
    return data;
  }
}
