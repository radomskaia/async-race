import { BaseModal } from "@/components/modal/base/base-modal.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { ActionType } from "@/types/event-emitter-types.ts";
import type { ModalData } from "@/types";
import {
  NOTIFICATION_TIME,
  TIME_MESSAGE,
  TWO,
  WINNER_MESSAGE,
} from "@/constants/constants.ts";
import { TypeNames } from "@/types/validator-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { DIContainer } from "@/services/di-container.ts";

export class WinnerModal extends BaseModal {
  private static instance: WinnerModal | undefined;
  private modalText: HTMLParagraphElement | null = null;
  private constructor() {
    super();
    this.modalWrapper.append(this.addContent());
    const validator = DIContainer.getInstance().getService(
      ServiceName.VALIDATOR,
    );
    this.registerEvent(ActionType.winnerDetected, (winner) => {
      if (validator.validate(TypeNames.modalData, winner)) {
        this.showWinnerModal(winner);
      }
    });
  }

  public static getInstance(): WinnerModal {
    if (!WinnerModal.instance) {
      WinnerModal.instance = new WinnerModal();
    }

    return WinnerModal.instance;
  }

  public showWinnerModal(winner: ModalData): void {
    this.changeWinner(winner);
    this.showModal();

    setTimeout(() => {
      this.element.close();
    }, NOTIFICATION_TIME);
  }

  public changeWinner(winner: ModalData): void {
    if (this.modalText) {
      this.modalText.textContent = `${WINNER_MESSAGE} ${winner.name} ${TIME_MESSAGE} ${winner.time.toFixed(TWO)}s`;
    }
  }

  protected addContent(): HTMLDivElement {
    const div = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.alignCenter,
        utilitiesStyles.gap20,
      ],
    });
    const text = this.createDOMElement({
      tagName: "p",
      classList: [],
    });

    this.modalText = text;
    div.append(text);
    return div;
  }
}
