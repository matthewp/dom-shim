import { domShimSymbol } from '../lib/mod.js?props=document,HTMLElement,requestAnimationFrame,Text';
import { assertEquals } from './deps.js';

Deno.test('Text can be extended from the defaultView', () => {
  const { Text } = self[domShimSymbol].document.defaultView;
  class Mark extends Text {
    get nodeType() {
      return -1;
    }
  }

  let mark = new Mark();
  assertEquals(mark.data, '');
});

Deno.test('Text can be extended from the root', () => {
  const { Text } = self[domShimSymbol];
  class Mark extends Text {
    get nodeType() {
      return -1;
    }
  }

  let mark = new Mark();
  assertEquals(mark.data, '');
});

Deno.test('Text can be inserted into DOM', () => {
  const { document, Text } = self[domShimSymbol];
  let div = document.createElement('div');
  let text = new Text();
  div.append(text);
  assertEquals(div.firstChild.nodeType, 3);
});

Deno.test('Extended Text can set its data', () => {
  const { Text } = self[domShimSymbol];
  class Mark extends Text {
    constructor(...args) {
      super(...args);
      this.data = 'works';
    }

    get nodeType() {
      return -1;
    }
  }
  let mark = new Mark();
  assertEquals(mark.data, 'works');
});

Deno.test('HTMLElement.observedAttributes is undefined', () => {
  const { HTMLElement } = self[domShimSymbol];
  assertEquals(HTMLElement.observedAttributes, undefined);
});

Deno.test('requestAnimationFrame can be used', async () => {
  let r;
  let p = new Promise(rr => { r = rr; });

  const { requestAnimationFrame } = self[domShimSymbol];
  let worked = false;
  requestAnimationFrame(() => {
    worked = true;
    r();
  });

  await p;
  assertEquals(worked, true);
});