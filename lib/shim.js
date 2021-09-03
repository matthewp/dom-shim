import { parseHTML } from 'https://unpkg.com/linkedom@0.11.0/worker.js';

export const domShimSymbol = Symbol.for('dom-shim.defaultView');
export const defaultGlobals = Object.freeze([
  'HTMLElement',
  'document',
  'customElements',
]);

const dontShimIfExists = new Set(['window']);

export default function (shimedGlobals = Object.freeze([])) {
  let parsed = parseHTML(`
    <html lang="en">
    <head><title>Site</title></head>
    <body></body>
    </html>
  `);

  // Patch Text
  let aTextNode = parsed.document.createTextNode('');
  let ConstructibleText = aTextNode.constructor.bind(null, parsed.document);

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
        },
      });
    }
  }

  Object.setPrototypeOf(Node, PatchedNode);
  Object.setPrototypeOf(Node.prototype, PatchedNode.prototype);

  // Patch requestAnimationFrame
  let lastTime = 0;
  function requestAnimationFrame(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  }

  const dfDescriptor = Object.getOwnPropertyDescriptor(
    parsed.Document.prototype,
    'defaultView'
  );
  Object.defineProperty(parsed.Document.prototype, 'defaultView', {
    get() {
      let window = dfDescriptor.get.call(this);

      return new Proxy(window, {
        get(window, name) {
          switch (name) {
            case 'Text':
              return ConstructibleText;
            case 'requestAnimationFrame':
              return requestAnimationFrame;
          }
          return window[name];
        },
      });
    },
  });

  // Patch HTMLElement
  delete parsed.HTMLElement.observedAttributes;

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
    unshim,
  };
}
