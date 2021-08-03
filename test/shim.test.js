import { domShimSymbol } from '../lib/mod.js';
import { assertEquals } from './deps.js';

Deno.test('Text can be extended', () => {
  const { Text } = self[domShimSymbol].document.defaultView;
  class Mark extends Text {
    get nodeType() {
      return -1;
    }
  }

  let mark = new Mark();
  assertEquals(mark.data, '');
});