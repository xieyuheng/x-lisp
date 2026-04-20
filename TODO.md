# li

[meta-lisp.js] `CodegenPass` -- `global-load` & `global-load` take index
[li.c] improve bytecode command -- can be used to save db to file

# later

[meta-lisp.js] meta-lisp -- check claimed undefined name

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

# about format

[helpers.c] improve `string_builder_t` for `format_*`

[li.c] [sexp] `sexp_format`
[li.c] [sexp] `sexp_print`
[li.c] [sexp] `sexp.snapshot` -- call `sexp_print`

[li.c] [builtin] `format-sexp`

# builtin source location

[li.c] builtin `error-with-source-location`
[li.c] builtin `assert-with-source-location`

# compose and pipe

[meta-lisp.js] [maybe] `pipe` and `compose` as `Exp`

# later

[li.c] string (specially small string) can be static like symbol
