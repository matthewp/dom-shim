import { domShimSymbol, Shim } from '../lib/shim.js';
import { assert } from './deps.js';

Deno.test('Takes globals', async () => {
  let s = new Shim(['document']);
  assert(s.values.document, 'document shimed');
});