# the

[basic] `compile` -- should not call variable

[vm] `call_function` instead of `call_definition`

[vm] remove `OP_ASSIGN_VARIABLE`

# the

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

`compile_quote` is saving list in function, need a way to value static
