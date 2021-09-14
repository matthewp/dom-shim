function patchText(window) {
  // Patch Text
  let aTextNode = window.document.createTextNode('');
  let ConstructibleText = aTextNode.constructor.bind(null, window.document);
  return ConstructibleText;
}

function patchNodeType(window, ConstructibleText) {
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
}

function patchRAF() {
  // Patch requestAnimationFrame
  let lastTime = 0;
  function requestAnimationFrame(callback, _element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  }
  return requestAnimationFrame;
}

function patchDefaultView(window, { requestAnimationFrame, Text }) {
  const dfDescriptor = Object.getOwnPropertyDescriptor(
    window.Document.prototype,
    'defaultView'
  );
  Object.defineProperty(window.Document.prototype, 'defaultView', {
    get() {
      let window = dfDescriptor.get.call(this);

      return new Proxy(window, {
        get(window, name) {
          switch (name) {
            case 'Text':
              return Text;
            case 'requestAnimationFrame':
              return requestAnimationFrame;
          }
          return window[name];
        },
      });
    },
  });
}

export function apply(window) {
  const ConstructibleText = patchText(window);
  patchNodeType(window, ConstructibleText);
  const requestAnimationFrame = patchRAF();

  patchDefaultView(window, {
    requestAnimationFrame,
    Text: ConstructibleText
  });

  // Patch HTMLElement
  delete window.HTMLElement.observedAttributes;
}