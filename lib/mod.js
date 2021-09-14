import setupShim, { domShimSymbol, defaultGlobals } from './shim.js';

const thisModuleURL = new URL(import.meta.url);

let shimedGlobals;
if (thisModuleURL.searchParams.has('props')) {
  shimedGlobals = thisModuleURL.searchParams.get('props').split(',');
} else {
  shimedGlobals = defaultGlobals;
}

let { shim, unshim } = setupShim(shimedGlobals);

if (thisModuleURL.searchParams.has('global')) {
  shim();
}

export { domShimSymbol, defaultGlobals, shim, unshim };
