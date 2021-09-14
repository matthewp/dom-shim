import { parseHTML } from 'https://unpkg.com/linkedom@0.11.0/worker.js';
import { apply as applyPatches } from './patch.js';

export const domShimSymbol = Symbol.for('dom-shim.defaultView');
export const defaultGlobals = Object.freeze([
  'HTMLElement',
  'document',
  'customElements',
]);

const dontShimIfExists = new Set(['window']);

export default function(shimedGlobals = Object.freeze([])) {
  let parsed = parseHTML(`
    <html lang="en">
    <head><title>Site</title></head>
    <body></body>
    </html>
  `);
  applyPatches(parsed);

  const window = parsed.document.defaultView;

  let shimValues = Object.create(null);
  for (let name of shimedGlobals) {
    if (dontShimIfExists.has(name) && name in globalThis) {
      continue;
    }
    Reflect.set(shimValues, name, window[name]);
  }

  Object.defineProperty(globalThis, domShimSymbol, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: shimValues,
  });

  function shim() {
    Object.assign(globalThis, shimValues);
  }

  function unshim() {
    for (let name of shimedGlobals) {
      if (globalThis[name] === shimValues[name]) {
        delete globalThis[name];
      }
    }
  }

  return {
    shim,
    unshim
  };
}