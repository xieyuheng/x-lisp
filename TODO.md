# builtin

[meta-lisp.js] [builtin] list -- (list-find p list) (list-find-index p list) -- use maybe

[meta-lisp.js] [builtin] hash
[meta-lisp.js] [builtin] set

[meta-lisp.js] `pipe` and `compose` as `Exp`

[meta-lisp.js] [builtin] list -- (list-group f list)
[meta-lisp.js] [builtin] list -- (list-product lhs rhs)

# linn

[linn.c] setup linn.c project -- copy code from basic-lisp.c
[linn.c] simple stack vm compiler
[linn.c] remove basic compiler

# basic-lisp missing builtin

[basic-lisp.c] missing builtin -- string

```scheme
(claim string-split (-> string-t string-t (list-t string-t)))
(claim string-lines (-> string-t (list-t string-t)))
(claim string-chars (-> string-t (list-t string-t)))
(claim string-replace (-> string-t string-t string-t string-t))
```

[basic-lisp.c] missing builtin -- random

```scheme
(claim random-int (-> int-t int-t int-t))
(claim random-float (-> float-t float-t float-t))
```

# basic-lisp

[basic-lisp.c] recover tests -- add `builtin/` prefix

# about format

[helpers.c] improve `string_builder_t` for `format_*`

[basic-lisp.c] [sexp] `sexp_format`
[basic-lisp.c] [sexp] `sexp_print`
[basic-lisp.c] [sexp] `sexp.snapshot` -- call `sexp_print`

[basic-lisp.c] [builtin] [maybe] `format-sexp`

# builtin source location

[basic-lisp.c] builtin `error-with-source-location`
[basic-lisp.c] builtin `assert-with-source-location`
