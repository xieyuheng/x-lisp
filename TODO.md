# string

[li.c] builtin -- string-split

```scheme
(claim string-split (-> string-t string-t (list-t string-t)))
```

[li.c] builtin -- string-replace

```scheme
(claim string-replace (-> string-t string-t string-t string-t))
```

# source location

[li.c] builtin `error-with-source-location`
[li.c] builtin `assert-with-source-location`

# format

[helpers.c] improve `string_builder_t` for `format_*`
[li.c] [sexp] `sexp_format`
[li.c] [sexp] `sexp_print`
[li.c] [sexp] `sexp.snapshot` -- call `sexp_print`
[li.c] [builtin] `format-sexp`

# db

[li.c] `db_add` -- `db_t` has info to support set-like api
[li.c] quit using `<fn>/is-test` -- should not use iter on definitions
[li.c] quit using `<fn>/is-variable` -- should not use iter on definitions
[li.c] [maybe] `db_save`
[li.c] builtin `open-db`

# vm

[li.c] redesign `global-load` & `global-load`
