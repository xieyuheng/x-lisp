[meta-lisp.js] `PrimitiveTypeDeclaration`
[meta-lisp.js] `DeclarePrimitiveType`
[meta-lisp.js] parse `declare-primitive-type`
[stack-lisp.c] call `stk_declare`

# format

[helpers.c] improve `string_builder_t` for `format_*`
[stack-lisp.c] [sexp] `sexp_format`
[stack-lisp.c] [sexp] `sexp_print`
[stack-lisp.c] [sexp] `sexp.snapshot` -- call `sexp_print`
[stack-lisp.c] [builtin] `format-sexp`

# error report

[stack-lisp.c] builtin -- `error-with-location` & `assert-with-location` -- print in context
[stack-lisp.c] error and assert -- print error to stderr -- instead of stdout
