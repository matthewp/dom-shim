import { parseHTML } from 'https://unpkg.com/linkedom@0.11.0/worker.js';

export const domShimSymbol = Symbol.for('dom-shim.defaultView');
export const defaultGlobals = Object.freeze(['HTMLElement', 'document', 'customElements']);

const thisModuleURL = new URL(import.meta.url);
let shimedGlobals;
if(thisModuleURL.searchParams.has('props')) {
  shimedGlobals = thisModuleURL.searchParams.get('props').split(',');
} else {
  shimedGlobals = defaultGlobals;
}

const parsed = parseHTML(`
  <html lang="en">
  <head><title>test</title></head>
  <body></body>
  </html>
`);

let shimValues = Object.create(null);
for(let name of shimedGlobals) {
  Reflect.set(shimValues, name, parsed[name]);
}

Object.defineProperty(globalThis, domShimSymbol, {
  enumerable: false,
  writable: true,
  configurable: true,
  value: shimValues
});

export function shim() {
  Object.assign(globalThis, shimValues);
}

export function unshim() {
  for(let name of shimedGlobals) {
    if(globalThis[name] === shimValues[name]) {
      delete globalThis[name];
    }
  }
}

if(thisModuleURL.searchParams.has('global')) {
  shim();
}