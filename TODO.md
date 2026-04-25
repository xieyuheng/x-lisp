# format

[helpers.c] `buffer_is_full_capacity`
[helpers.c] `buffer_double_capacity`

[helpers.c] `buffer_get_byte`
[helpers.c] `buffer_put_byte`

[helpers.c] remove `string_builder_t` -- use `buffer_t`

- `format_*` functions take `buffer_t` as first argument

[stack-lisp.c] sexp -- `sexp_format`
[stack-lisp.c] sexp -- `sexp_print`
[stack-lisp.c] sexp -- `sexp.snapshot` -- call `sexp_print`

[stack-lisp.c] builtin -- `format-sexp`

# feedback

[stack-lisp.c] `error` & `assert` & `assert-equal` -- print error to stderr -- instead of stdout
[stack-lisp.c] builtin -- `error-with-location` & `assert-with-location` -- print in context

# self-hosting

[meta-lisp.meta] `definition-t`
[meta-lisp.meta] `mod-t`
[meta-lisp.meta] `eval`
[meta-lisp.meta] `parse`
