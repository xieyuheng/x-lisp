[basic] fix loading order to support circular import

# later

[helpers.c] improve `string_builder_t` for `format_*`
[sexp] `format_sexp`
[sexp] `print_sexp`
[sexp] `sexp.snapshot` -- call `print_sexp`

# later

[builtin] `(assert-with-meta)` -- `(assert)` should be compiled to `(assert-with-meta)`
[basic] handle `(assert)` in `ShrinkPass`
