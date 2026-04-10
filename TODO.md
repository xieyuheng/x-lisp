# new module system

[meta-lisp.js] `projectBuild` -- bundle project to single basic file -- no need `QualifiedVar` in basic-lisp
[meta-lisp.js] basic-lisp support `(define-test)` -- fix `030-ExplicateControlPass`

# stack-lisp

[stack-lisp.c] with a key-value database

# later

[meta-lisp.js] [maybe] project load by topological order (dynamicly)

# prelude

[meta-lisp.js] be able to use prelude module

# about file

[meta-lisp.js] [prelude] call-with-input-file
[meta-lisp.js] [prelude] call-with-output-file

# new (no) module system

[basic-lisp.c] remove module system

# about format

[helpers.c] improve `string_builder_t` for `format_*`

[basic-lisp.c] [sexp] `sexp_format`
[basic-lisp.c] [sexp] `sexp_print`
[basic-lisp.c] [sexp] `sexp.snapshot` -- call `sexp_print`

[basic-lisp.c] [builtin] [maybe] `format-sexp`

# builtin source location

[basic-lisp.c] builtin `error-with-source-location`
[basic-lisp.c] builtin `assert-with-source-location`
