# feedback

[meta-lisp.js] `check` command support `--verbose` options
[stack-lisp.c] `test` command support `--profile` options -- print parsing time and execution time
[stack-lisp.c] rename `printer_t` to something about finding circle
[stack-lisp.c] `error` & `assert` & `assert-equal` -- print error to stderr -- instead of stdout
[stack-lisp.c] builtin -- `error-with-location` & `assert-with-location` -- print in context

# format

[helpers.c] [maybe] rename `string_builder_t` to something like `formatter_t`
[helpers.c] improve `string_builder_t` for `format_*`
[stack-lisp.c] sexp -- `sexp_format`
[stack-lisp.c] sexp -- `sexp_print`
[stack-lisp.c] sexp -- `sexp.snapshot` -- call `sexp_print`
[stack-lisp.c] builtin -- `format-sexp`

# self-hosting

[meta-lisp.meta] `definition-t`
[meta-lisp.meta] `mod-t`
[meta-lisp.meta] `eval`
[meta-lisp.meta] `parse`
