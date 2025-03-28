import { LS_PREFIX } from "@/constants/constants.ts";
import type { OptionListValue, TypeGuard, StorageKeys } from "@/types";

export class LocalStorage {
  private static instance = new LocalStorage();
  private readonly prefix: string;

  private constructor() {
    this.prefix = LS_PREFIX;
  }
  public static getInstance(): LocalStorage {
    return LocalStorage.instance;
  }

  public save(key: StorageKeys, value: OptionListValue | boolean): void {
    const storageKey = this.prefix + key;
    globalThis.localStorage.setItem(storageKey, JSON.stringify(value));
  }

  public load<T>(key: StorageKeys, typeGuard: TypeGuard<T>): T | null {
    const storageKey = this.prefix + key;
    const value = globalThis.localStorage.getItem(storageKey);
    if (!value) {
      return null;
    }
    try {
      const result = JSON.parse(value);
      if (typeGuard(result)) {
        return result;
      }
      return null;
    } catch {
      return null;
    }
  }
}
