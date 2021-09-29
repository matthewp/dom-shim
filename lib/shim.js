import { parseHTML } from 'https://unpkg.com/linkedom@0.12.0/worker.js';
import { apply as applyPatches } from './patch.js';

export const domShimSymbol = Symbol.for('dom-shim.defaultView');
export const defaultGlobals = Object.freeze([
  'HTMLElement',
  'document',
  'customElements',
]);

const dontShimIfExists = new Set(['window']);

export class Shim {
  constructor(shimedGlobals = Object.freeze([])) {
    this.globals = shimedGlobals;
    this.setup();
  }

  setup() {
    let parsed = parseHTML(`
      <html lang="en">
      <head><title>Site</title></head>
      <body></body>
      </html>
    `);
    applyPatches(parsed);

    const window = parsed.document.defaultView;

    let shimValues = this.values = Object.create(null);
    for (let name of this.globals) {
      if (dontShimIfExists.has(name) && name in globalThis) {
        continue;
      }
      Reflect.set(shimValues, name, window[name]);
    }
  }

  apply() {
    Object.defineProperty(globalThis, domShimSymbol, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: this.values,
    });
  }

  shim() {
    if(!(domShimSymbol in globalThis))
      this.apply();

    Object.assign(globalThis, this.values);
  }

  unshim() {
    for (let name of this.globals) {
      if (globalThis[name] === this.values[name]) {
        delete globalThis[name];
      }
    }
  }
}