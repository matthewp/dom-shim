# dom-shim

Shim the global environment with DOM globals. Useful for loading web component code. Powered by [linkedom](https://github.com/WebReflection/linkedom)

## Usage

Importing the module by default does *not* clobber global values, but rather adds a symbol to the global where DOM shims are placed. You can retrieve them like so:

```js
import { domShimSymbol } from 'https://cdn.spooky.click/dom-shim/1.3.1/mod.js';

const { HTMLElement, customElements } = globalThis[domShimSymbol];
```

Commonly you *will* want to clobber globals for library support. To do so add the `?global` query param.

```js
import 'https://cdn.spooky.click/dom-shim/1.3.1/mod.js?global';
```

You can use the `unshim` export to remove the globals if you only want them available temporarily.

```js
import { unshim } from 'https://cdn.spooky.click/dom-shim/1.3.1/mod.js?global';
import './some-element.js';

// We only needed the shim to load some-element.js, now remove them.
unshim();
```

You can specify *which* DOM globals are added by adding a comma-separated `props` query param like so:

```js
import 'https://cdn.spooky.click/dom-shim/1.3.1/mod.js?global&props=HTMLDivElement,HTMLParagraphElement,customElements';
```

### Side-effect free entry point

If your runtime does not support query params (most bundlers) or you do not want the side-effect to take place immediate, you can use the other entry point `shim.js` like so:

```js
import { Shim } from 'https://cdn.spooky.click/dom-shim/1.3.1/shim.js';

let s = new Shim(['document']);
console.log(s.values); // { document }

// To apply the shim symbol to the global environment
s.apply();

// If you want the globals to be set on the global environment
s.shim();
```

Creating a new `Shim` instance will create the shimmed environment. Calling `s.apply()` will set the environment on the `Symbol.for('dom-shim.defaultView')` property. Calling `s.shim()` will apply the globals onto the environments `globalThis`.

> Note: if you call `.shim()` then you do not need to also call `.apply()`.

## License

BSD-2-Clause