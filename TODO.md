# source location

[meta-lisp.js] desugar `error` to `error-with-source-location`

[li.c] builtin `error-with-source-location` -- print in context
[li.c] builtin `assert-with-source-location`

# format

[helpers.c] improve `string_builder_t` for `format_*`
[li.c] [sexp] `sexp_format`
[li.c] [sexp] `sexp_print`
[li.c] [sexp] `sexp.snapshot` -- call `sexp_print`
[li.c] [builtin] `format-sexp`

# vm

[li.c] redesign `global-load` & `global-load`
