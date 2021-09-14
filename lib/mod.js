import { domShimSymbol, defaultGlobals, Shim } from './shim.js';

const thisModuleURL = new URL(import.meta.url);

let shimedGlobals;
if (thisModuleURL.searchParams.has('props')) {
  shimedGlobals = thisModuleURL.searchParams.get('props').split(',');
} else {
  shimedGlobals = defaultGlobals;
}

let s = new Shim(shimedGlobals);
s.apply();
let shim = s.shim.bind(s);
let unshim = s.unshim.bind(s);

if (thisModuleURL.searchParams.has('global')) {
  shim();
}

export { domShimSymbol, defaultGlobals, shim, unshim };
