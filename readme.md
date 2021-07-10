# dom-shim

Shim the global environment with DOM globals. Useful for loading web component code.

## Usage

Importing the module by default does *not* clobber global values, but rather adds a symbol to the global where DOM shims are placed. You can retrieve them like so:

```js
import { domShimSymbol } from 'https://cdn.spooky.click/dom-shim/1.0.0/mod.js';

const { HTMLElement, customElements } = globalThis[domShimSymbol];
```

Commonly you *will* want to clobber globals for library support. To do so add the `?global` query param.

```js
import 'https://cdn.spooky.click/dom-shim/1.0.0/mod.js?global';
```

You can use the `unshim` export to remove the globals if you only want them available temporarily.

```js
import { unshim } from 'https://cdn.spooky.click/dom-shim/1.0.0/mod.js?global';
import './some-element.js';

// We only needed the shim to load some-element.js, now remove them.
unshim();
```

You can specify *which* DOM globals are added by adding a comma-separated `props` query param like so:

```js
import 'https://cdn.spooky.click/dom-shim/1.0.0/mod.js?global&props=HTMLDivElement,HTMLParagraphElement,customElements';
```

## License

BSD-2-Clause