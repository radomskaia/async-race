import type { ResponseCarData } from "@/types/api-service-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { BasePagination } from "@/components/pagination/base-pagination.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import {
  CARS_PER_PAGE,
  ERROR_MESSAGES,
  PAGE_NAME,
} from "@/constants/constants.ts";
import { errorHandler } from "@/utilities/utilities.ts";
import { TypeNames } from "@/types/validator-types.ts";
import type { GarageService } from "@/services/api/garage-service.ts";

export class GaragePagination extends BasePagination<
  GarageService,
  ResponseCarData
> {
  protected limit;
  protected eventEmitter;
  protected apiHandler;
  private validator = DIContainer.getInstance().getService(
    ServiceName.VALIDATOR,
  );
  constructor() {
    super(PAGE_NAME.GARAGE);
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
        (this.validator.validate(TypeNames.number, newPage) ||
          newPage === null) &&
        (this.validator.validate(TypeNames.boolean, isCreate) ||
          isCreate === undefined)
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
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
    }
    return data;
  }
}
