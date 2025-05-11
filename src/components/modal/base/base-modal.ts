import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import styles from "@/components/modal/base/modal.module.css";
import { errorHandler } from "@/utilities/utilities.ts";

export abstract class BaseModal extends BaseComponent<"dialog"> {
  protected readonly modalWrapper: HTMLDivElement;

  protected constructor() {
    super();
    this.modalWrapper = this.addWrapper();
    this.element.addEventListener("close", () => {
      this.element.remove();
    });
  }

  public showModal(): void {
    document.body.append(this.element);
    try {
      this.element.showModal();
    } catch (error) {
      errorHandler(error);
    }
  }

  protected createElement(): HTMLDialogElement {
    const modal = this.createDOMElement({
      tagName: "dialog",
      classList: [styles.modal],
    });
    modal.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        this.element.close();
      }
    });
    return modal;
  }

  protected addWrapper(): HTMLDivElement {
    const modalWrapper = this.createDOMElement({
      tagName: "div",
      classList: [
        styles.wrapper,
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.alignCenter,
        utilitiesStyles.gap20,
      ],
    });
    this.element.append(modalWrapper);
    return modalWrapper;
  }

  protected abstract addContent(): HTMLElement;
}
