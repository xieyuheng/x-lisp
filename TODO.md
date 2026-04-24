# compile to stack-lisp

[stack-lisp.c] suport `(declare-primitive-variable)` & `(declare-primitive-function)`

[meta-lisp.js] pass -- `ExplicateControlPass` -- compile to `TestDefinition`
[meta-lisp.js] pass -- `CodegenPass` to stack-lisp -- instead of li

# remove li

[stack-lisp.c] move li.c to dustbin
[stack-lisp.c] update todo list

# format

[helpers.c] improve `string_builder_t` for `format_*`
[li.c] [sexp] `sexp_format`
[li.c] [sexp] `sexp_print`
[li.c] [sexp] `sexp.snapshot` -- call `sexp_print`
[li.c] [builtin] `format-sexp`

# error report

[li.c] builtin -- `error-with-location` & `assert-with-location` -- print in context
[li.c] error and assert -- print error to stderr -- instead of stdout
