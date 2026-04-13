# new module system

[basic-lisp.c] `mod_t` -- has `db`
[basic-lisp.c] `basic_db_transact`
[basic-lisp.c] `db-dump file` command -- with `.db` extension
[basic-lisp.c] lib/tests/db

[meta-lisp.js] recover `projectTest` -- call basic-lisp interpreter

# about format

[helpers.c] improve `string_builder_t` for `format_*`

[basic-lisp.c] [sexp] `sexp_format`
[basic-lisp.c] [sexp] `sexp_print`
[basic-lisp.c] [sexp] `sexp.snapshot` -- call `sexp_print`

[basic-lisp.c] [builtin] [maybe] `format-sexp`

# builtin source location

[basic-lisp.c] builtin `error-with-source-location`
[basic-lisp.c] builtin `assert-with-source-location`

# later

[meta-lisp.js] [maybe] project load by topological order (dynamicly)

# prelude

[meta-lisp.js] be able to use prelude module

# about file

[meta-lisp.js] [prelude] call-with-input-file
[meta-lisp.js] [prelude] call-with-output-file
