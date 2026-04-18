# builtin

[meta-lisp.js] [builtin] `(hash-entry-t K V)` -- by `DefineTypeFunction`

[meta-lisp.js] [builtin] list -- (list-map-zip f left right)
[meta-lisp.js] [builtin] list -- (list-find p list) (list-find-index p list)
[meta-lisp.js] [builtin] list -- (list-group f list)
[meta-lisp.js] [builtin] list -- (list-product lhs rhs)

[meta-lisp.js] [builtin] hash
[meta-lisp.js] [builtin] set

# linn

[linn.c] setup linn.c project -- copy code from basic-lisp.c
[linn.c] simple stack vm compiler
[linn.c] remove basic compiler

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
