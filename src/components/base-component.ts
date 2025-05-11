import { SVG_CONFIG } from "@/constants/buttons-constants.ts";
import type {
  Action,
  ActionType,
  Observer,
  RegisterEvent,
} from "@/types/event-emitter-types.ts";
import type { Callback } from "@/types/button-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import type {
  AddAttributes,
  AddClassList,
  AddTextContent,
  CreateDOMElement,
  CreateSVG,
} from "@/types/base-component-types.ts";
import { ERROR_MESSAGES } from "@/constants/constants.ts";

export abstract class BaseComponent<
  T extends keyof HTMLElementTagNameMap,
  O = void,
> implements Observer
{
  protected element: HTMLElementTagNameMap[T];
  protected listeners = new Map<ActionType, Callback[]>();

  protected constructor(options?: O) {
    this.element = this.createElement(options);
  }

  public registerEvent: RegisterEvent = (eventType, callback) => {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    const callbackArray = this.listeners.get(eventType);
    callbackArray?.push(callback);
    DIContainer.getInstance()
      .getService(ServiceName.EVENT_EMITTER)
      .subscribe(eventType, this);
  };

  public update(event: Action): void {
    const callbackArray = this.listeners.get(event.type);
    if (!callbackArray) {
      console.info(ERROR_MESSAGES.NO_LISTENERS);
      return;
    }
    for (const callback of callbackArray) {
      callback(event.data);
    }
  }

  public getElement(): HTMLElementTagNameMap[T] {
    return this.element;
  }

  public appendElement(...child: Element[]): void {
    this.element.append(...child);
  }

  public addTextContent: AddTextContent = (textContent, element) => {
    element = element ?? this.element;
    element.textContent = textContent;
  };

  public clearElement(): void {
    this.element.replaceChildren();
  }

  protected createDOMElement: CreateDOMElement = ({
    tagName,
    classList,
    textContent,
    attributes,
  }) => {
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
  };

  protected addClassList: AddClassList = (classList, element?) => {
    element = element ?? this.element;
    element.classList.add(...classList);
  };

  protected addAttributes: AddAttributes = (attributes, element?) => {
    element = element ?? this.element;
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  };

  protected createSVG: CreateSVG = ({ path, classList, attributes }) => {
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
    return { use, svg };
  };

  protected abstract createElement(options?: O): HTMLElementTagNameMap[T];
}
