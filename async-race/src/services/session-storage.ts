import { LS_PREFIX } from "@/constants/constants.ts";
import type {
  SessionStorageInterface,
  TypeGuard,
} from "@/types/session-storage-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";

export class SessionStorage implements SessionStorageInterface {
  public name = ServiceName.STORAGE;
  private readonly prefix: string;

  constructor() {
    this.prefix = LS_PREFIX;
  }

  public save(key: string, value: unknown): void {
    const storageKey = this.prefix + key;
    globalThis.sessionStorage.setItem(storageKey, JSON.stringify(value));
  }

  public load<T>(key: string, typeGuard: TypeGuard<T>): T | null {
    const storageKey = this.prefix + key;
    const value = globalThis.sessionStorage.getItem(storageKey);
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
