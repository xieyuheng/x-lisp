[builtin] `x_the` -- fix `the.snapshot.basic`
[builtin] `x_the` -- literal atom as schema

# later

[helpers.c] improve `string_builder_t` for `format_*`

[sexp] `sexp_format`
[sexp] `sexp_print`
[sexp] `sexp.snapshot` -- call `sexp_print`

# later

[builtin] `(assert-with-meta)` -- `(assert)` should be compiled to `(assert-with-meta)`
[basic] handle `(assert)` in `ShrinkPass`

# bug

`compile_quote` is saving list in funcion, need a way to value static
