import { domShimSymbol } from '../lib/mod.js?props=document,Text';
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