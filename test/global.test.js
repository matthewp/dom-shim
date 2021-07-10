import { unshim, defaultGlobals } from '../lib/mod.js?global';
import { assert, assertEquals } from './deps.js';

Deno.test('Adds the default props to the self', () => {
  for(let name of defaultGlobals) {
    assert(self[name], `[${name}] added to the global`);
  }
});

Deno.test('Calling unshim will remove the globals', () => {
  unshim();
  assertEquals(self.HTMLElement, undefined, 'A global is removed');
});