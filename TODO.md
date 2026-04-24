# compile to stack-lisp

[meta-lisp.js] stack -- `formatInstr`
[meta-lisp.js] stack -- `formatDefinition`
[meta-lisp.js] stack -- `formatMod`

[stack-lisp.c] suport `(declare-primitive-variable)` & `(declare-primitive-function)`
[stack-lisp.c] suport `(define-test)`
[meta-lisp.js] basic -- `TestDefinition`

[meta-lisp.js] stack -- `CodegenPass` to stack-lisp -- instead of li

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
