export class MemoryStorage {
  clear() {
    Object.keys(this).forEach((key) => delete this[key]);
  }

  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this, key) ? this[key] : null;
  }

  removeItem(key) {
    delete this[key];
  }

  setItem(key, value) {
    this[key] = String(value);
  }
}

export function installBrowserGlobals() {
  globalThis.localStorage = new MemoryStorage();
  globalThis.sessionStorage = new MemoryStorage();
  globalThis.window = new EventTarget();
  if (typeof globalThis.CustomEvent === "undefined") {
    globalThis.CustomEvent = class CustomEvent extends Event {
      constructor(type, options = {}) {
        super(type, options);
        this.detail = options.detail;
      }
    };
  }
}
