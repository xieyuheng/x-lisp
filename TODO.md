# li as db

[li.c] `db_add` -- `db_t` has info to support set-like api
[li.c] quit using `<fn>/is-test` -- should not use iter on definitions
[li.c] quit using `<fn>/is-variable` -- should not use iter on definitions

# li db

[li.c] [maybe] `open-db`

# about format

[helpers.c] improve `string_builder_t` for `format_*`

[li.c] [sexp] `sexp_format`
[li.c] [sexp] `sexp_print`
[li.c] [sexp] `sexp.snapshot` -- call `sexp_print`

[li.c] [builtin] `format-sexp`

# builtin source location

[li.c] builtin `error-with-source-location`
[li.c] builtin `assert-with-source-location`

# li

[li.c] redesign `global-load` & `global-load`

# li missing builtin

[li.c] missing builtin -- string

```scheme
(claim string-split (-> string-t string-t (list-t string-t)))
(claim string-lines (-> string-t (list-t string-t)))
(claim string-chars (-> string-t (list-t string-t)))
(claim string-replace (-> string-t string-t string-t string-t))
```

[li.c] missing builtin -- random

```scheme
(claim random-int (-> int-t int-t int-t))
(claim random-float (-> float-t float-t float-t))
```
