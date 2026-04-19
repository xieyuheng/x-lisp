# linn

[meta-lisp.js] `CodegenPass` -- `onVar`
[meta-lisp.js] `CodegenPass` -- `onApply` & `onTailApply`

[meta-lisp.js] `CodegenPass` -- `onBlock` -- handle label

[meta-lisp.js] `CodegenPass` -- `onStmt` -- `DefineFunction` -- handle arity
[meta-lisp.js] `CodegenPass` -- `onStmt` -- `DefineFunction` -- handle parameters
[meta-lisp.js] `CodegenPass` -- `onStmt` -- `DefineVariable` -- handle is variable flag

[linn.c] `execute_ins_line` -- append instruction to function -- learn from [basic-lisp.c] `compile_exp`

# remove basic-lisp

[meta-lisp.js] remove basic-lisp.js
[linn.c] update todo list

# later

[linn.c] string (specially small string) can be static like symbol

# basic-lisp

[basic-lisp.c] recover tests -- add `builtin/` prefix

# basic-lisp missing builtin

[basic-lisp.c] missing builtin -- string

```scheme
(claim string-split (-> string-t string-t (list-t string-t)))
(claim string-lines (-> string-t (list-t string-t)))
(claim string-chars (-> string-t (list-t string-t)))
(claim string-replace (-> string-t string-t string-t string-t))
```

[basic-lisp.c] missing builtin -- random

```scheme
(claim random-int (-> int-t int-t int-t))
(claim random-float (-> float-t float-t float-t))
```

# about format

[helpers.c] improve `string_builder_t` for `format_*`

[basic-lisp.c] [sexp] `sexp_format`
[basic-lisp.c] [sexp] `sexp_print`
[basic-lisp.c] [sexp] `sexp.snapshot` -- call `sexp_print`

[basic-lisp.c] [builtin] [maybe] `format-sexp`

# builtin source location

[basic-lisp.c] builtin `error-with-source-location`
[basic-lisp.c] builtin `assert-with-source-location`

# compose and pipe

[meta-lisp.js] `pipe` and `compose` as `Exp`
