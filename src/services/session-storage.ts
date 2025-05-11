import { LS_PREFIX } from "@/constants/constants.ts";
import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import type { TypeNames, TypesForValidator } from "@/types/validator-types.ts";
import { DIContainer } from "@/services/di-container.ts";

export class SessionStorage implements Injectable {
  public name = ServiceName.STORAGE;
  private readonly prefix = LS_PREFIX;
  private validator = DIContainer.getInstance().getService(
    ServiceName.VALIDATOR,
  );

  public save(key: string, value: unknown): void {
    const storageKey = this.prefix + key;
    globalThis.sessionStorage.setItem(storageKey, JSON.stringify(value));
  }

  public load<T extends TypeNames>(
    key: string,
    typeName: T,
  ): TypesForValidator[T] | null {
    const storageKey = this.prefix + key;
    const value = globalThis.sessionStorage.getItem(storageKey);
    if (!value) {
      return null;
    }
    try {
      const result = JSON.parse(value);
      if (this.validator.validate(typeName, result)) {
        return result;
      }
      return null;
    } catch {
      return null;
    }
  }
}
