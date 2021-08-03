import { parseHTML } from 'https://unpkg.com/linkedom@0.11.0/worker.js';

export const domShimSymbol = Symbol.for('dom-shim.defaultView');
export const defaultGlobals = Object.freeze(['HTMLElement', 'document', 'customElements']);

const dontShimIfExists = new Set(['window']);

const thisModuleURL = new URL(import.meta.url);
let shimedGlobals;
if(thisModuleURL.searchParams.has('props')) {
  shimedGlobals = thisModuleURL.searchParams.get('props').split(',');
} else {
  shimedGlobals = defaultGlobals;
}

let parsed = parseHTML(`
  <html lang="en">
  <head><title>Site</title></head>
  <body></body>
  </html>
`);

// Patch Text
let aTextNode = parsed.document.createTextNode('');
let ConstructibleText = aTextNode.constructor;

// Patch Node
const CharacterData = Object.getPrototypeOf(ConstructibleText);
const Node = Object.getPrototypeOf(CharacterData);
const EventTarget = Object.getPrototypeOf(Node);

const ntSymbol = Symbol('dom-shim.nodeType');
class PatchedNode extends EventTarget {
  constructor() {
    super();

    Object.defineProperty(this, 'nodeType', {
      get() {
        return this[ntSymbol];
      },
      set(val) {
        this[ntSymbol] = val;
      }
    });
  }
}

Object.setPrototypeOf(Node, PatchedNode);
Object.setPrototypeOf(Node.prototype, PatchedNode.prototype);

const dfDescriptor = Object.getOwnPropertyDescriptor(parsed.Document.prototype, 'defaultView');
Object.defineProperty(parsed.Document.prototype, 'defaultView', {
  get() {
    let window = dfDescriptor.get.call(this);

    return new Proxy(window, {
      get(window, name) {
        switch(name) {
          case 'Text': return ConstructibleText;
        }
        return window[name];
      }
    });
  }
});


let shimValues = Object.create(null);
for(let name of shimedGlobals) {
  if(dontShimIfExists.has(name) && name in globalThis) {
    continue;
  }
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