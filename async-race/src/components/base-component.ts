import type { ElementOptions } from "src/types";

export abstract class BaseComponent<
  T extends keyof HTMLElementTagNameMap,
  O = void,
> {
  protected element: HTMLElementTagNameMap[T];
  protected constructor(options?: O) {
    this.element = this.createView(options);
  }

  public getElement(): HTMLElementTagNameMap[T] {
    return this.element;
  }

  public appendElement(...child: Element[]): void {
    this.element.append(...child);
  }

  public clearElement(): void {
    this.element.replaceChildren();
  }

  protected createDOMElement<T extends keyof HTMLElementTagNameMap>({
    tagName,
    classList,
    textContent,
    attributes,
  }: ElementOptions<T>): HTMLElementTagNameMap[T] {
    const element = document.createElement(tagName);
    if (classList) {
      this.addClassList(classList, element);
    }
    if (attributes) {
      this.addAttributes(attributes, element);
    }
    if (textContent) {
      this.addTextContent(textContent, element);
    }

    return element;
  }

  protected addClassList(classList: string[], element?: Element): void {
    element = element ?? this.element;
    element.classList.add(...classList);
  }

  protected addAttributes(
    attributes: Record<string, string>,
    element?: Element,
  ): void {
    element = element ?? this.element;
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  }

  protected addTextContent(textContent: string, element: Element): void {
    element = element ?? this.element;
    element.textContent = textContent;
  }

  protected abstract createView(options?: O): HTMLElementTagNameMap[T];
}
