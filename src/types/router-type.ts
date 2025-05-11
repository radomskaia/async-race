import type { BaseComponent } from "@/components/base-component.ts";

export type ComponentConstructor = new () => BaseComponent<"div">;
export type Route = Map<string, ComponentConstructor>;
