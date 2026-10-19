# @xieyuheng/x-lisp-shiki.ts

Shiki TextMate grammars for the x-lisp language family.

## Exports

```ts
import { MetaLisp } from "@xieyuheng/x-lisp-shiki.ts"
import { BasicLisp } from "@xieyuheng/x-lisp-shiki.ts"
import { XvmLisp } from "@xieyuheng/x-lisp-shiki.ts"
import { X86Lisp } from "@xieyuheng/x-lisp-shiki.ts"
```

Each language is also available through a subpath and as the default export:

```ts
import MetaLisp from "@xieyuheng/x-lisp-shiki.ts/meta-lisp"
import BasicLisp from "@xieyuheng/x-lisp-shiki.ts/basic-lisp"
import XvmLisp from "@xieyuheng/x-lisp-shiki.ts/xvm-lisp"
import X86Lisp from "@xieyuheng/x-lisp-shiki.ts/x86-lisp"
```

The default exports are suitable for loaders such as
`createBundledHighlighter`:

```ts
const languageLoaders = {
  "meta-lisp": () => import("@xieyuheng/x-lisp-shiki.ts/meta-lisp"),
  "basic-lisp": () => import("@xieyuheng/x-lisp-shiki.ts/basic-lisp"),
  "xvm-lisp": () => import("@xieyuheng/x-lisp-shiki.ts/xvm-lisp"),
  "x86-lisp": () => import("@xieyuheng/x-lisp-shiki.ts/x86-lisp"),
}
```

VitePress can register them directly:

```ts
markdown: {
  languages: [MetaLisp, BasicLisp, XvmLisp, X86Lisp],
}
```

This package contains only Shiki language registrations. It does not create or
configure a highlighter.
