import setupShim, { domShimSymbol } from '../lib/shim.js';
import { assert } from './deps.js';

Deno.test('Takes globals', async () => {
  setupShim(['document']);
  let root = globalThis[domShimSymbol];
  assert(root.document, 'document shimed');
});