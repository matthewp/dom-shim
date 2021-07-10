import { unshim, defaultGlobals } from '../lib/mod.js?global&props=HTMLDivElement,HTMLParagraphElement';
import { assert, assertEquals } from './deps.js';

Deno.test('Adds the props to the self', () => {
  assert(self.HTMLDivElement);
  assert(self.HTMLParagraphElement);
});

Deno.test('Does not add the defaults', () => {
  for(let name of defaultGlobals) {
    assertEquals(self[name], undefined, 'default not added');
  }
});

Deno.test('unshim removes the globals', () => {
  unshim();
  assertEquals(self.HTMLDivElement, undefined);
  assertEquals(self.HTMLParagraphElement, undefined);
});