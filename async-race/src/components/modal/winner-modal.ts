import { BaseModal } from "@/components/modal/base/base-modal.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import styles from "@/components/modal/base/modal.module.css";
import type { WinnerData } from "@/types/api-service-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import { isWinnerData } from "@/services/validator.ts";

export class WinnerModal extends BaseModal {
  private static instance: WinnerModal | undefined;
  private modalText: HTMLParagraphElement | null = null;
  private constructor() {
    super();
    this.modalWrapper.append(this.addContent());
    this.registerEvent(ActionType.winnerDetected, (winner) => {
      console.log(winner);
      if (isWinnerData(winner)) {
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

  public showWinnerModal(winner: WinnerData): void {
    this.changeWinner(JSON.stringify(winner));
    this.showModal();
  }

  public changeWinner(winner: string): void {
    if (this.modalText) {
      console.log(this.modalText.textContent);
      this.modalText.textContent = winner;
      console.log(this.modalText);
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
      classList: [styles.validText],
      textContent: "QQQQQQQ",
    });

    this.modalText = text;
    div.append(text);
    return div;
  }
}
