# new module system

[meta-lisp.js] [basic] `DbOperation`

- (add e a v)
- (delete e a v)
- (delete-attribute e a)
- (delete-entity e)
- (put e a v) -- (delete-attribute e a) + (add e a v)
- (put-unique e a v)

[meta-lisp.js] [basic] `formatDbOperation`

[meta-lisp.js] compile `(define-test)` to metadata -- fix `030-ExplicateControlPass` on `TestDefinition`

[basic-lisp.c] design a database to store metadata

[meta-lisp.js] recover `projectTest` -- call basic-lisp interpreter

# later

[meta-lisp.js] [maybe] project load by topological order (dynamicly)

# prelude

[meta-lisp.js] be able to use prelude module

# about file

[meta-lisp.js] [prelude] call-with-input-file
[meta-lisp.js] [prelude] call-with-output-file

# about format

[helpers.c] improve `string_builder_t` for `format_*`

[basic-lisp.c] [sexp] `sexp_format`
[basic-lisp.c] [sexp] `sexp_print`
[basic-lisp.c] [sexp] `sexp.snapshot` -- call `sexp_print`

[basic-lisp.c] [builtin] [maybe] `format-sexp`

# builtin source location

[basic-lisp.c] builtin `error-with-source-location`
[basic-lisp.c] builtin `assert-with-source-location`
