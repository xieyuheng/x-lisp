[value] xrecord

[builtin] use xlist
[builtin] use xrecord

[sexp] use xlist instead of tael

remove tael

remove null from value
encode bool and void in value directly

# later

[helpers.c] improve `string_builder_t` for `format_*`

[sexp] `sexp_format`
[sexp] `sexp_print`
[sexp] `sexp.snapshot` -- call `sexp_print`

# later

[builtin] `(assert-with-meta)` -- `(assert)` should be compiled to `(assert-with-meta)`
[basic] handle `(assert)` in `ShrinkPass`

# bug

`compile_quote` is saving list in function, need a way to value static
