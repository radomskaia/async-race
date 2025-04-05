import type { CreateSVGIconOptions, ElementOptions } from "src/types";
import { SVG_CONFIG } from "@/constants/buttons-constants.ts";

export abstract class BaseComponent<
  T extends keyof HTMLElementTagNameMap,
  O = void,
> {
  protected element: HTMLElementTagNameMap[T];
  protected constructor(options?: O) {
    this.element = this.createElement(options);
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

  protected createSVG({ path, classList, attributes }: CreateSVGIconOptions): {
    use: SVGUseElement;
    svg: SVGElement;
  } {
    const svg = document.createElementNS(SVG_CONFIG.NAMESPACE_SVG, "svg");
    this.addAttributes({ ...attributes, role: SVG_CONFIG.ROLE }, svg);
    this.addClassList(classList, svg);
    const use = document.createElementNS(SVG_CONFIG.NAMESPACE_SVG, "use");
    use.setAttributeNS(
      SVG_CONFIG.NAMESPACE_XLINK,
      SVG_CONFIG.QUALIFIED_NAME,
      path,
    );
    svg.append(use);
    // this.appendElement(svg);
    return { use, svg };
  }

  protected abstract createElement(options?: O): HTMLElementTagNameMap[T];
}
