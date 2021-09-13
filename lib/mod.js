import Shim, { domShimSymbol, defaultGlobals } from './shim.js';

const thisModuleURL = new URL(import.meta.url);

let shimedGlobals;
if (thisModuleURL.searchParams.has('props')) {
  shimedGlobals = thisModuleURL.searchParams.get('props').split(',');
} else {
  shimedGlobals = defaultGlobals;
}

const { shim, unshim } = Shim(shimedGlobals);

if (thisModuleURL.searchParams.has('global')) {
  shim();
}

export { domShimSymbol, defaultGlobals, shim, unshim };
