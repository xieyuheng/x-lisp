[meta-lisp.js] `UniquifyPass` -- take `state`
[meta-lisp.js] `DesugarPass` -- `desugar` -- `State` has `nameCounts` and `nameTable`
[meta-lisp.js] `DesugarPass` -- `desugarLet` -- desugar `(let)` to `(let*)`

# parse

[meta-lisp.meta] `parse-body` -- `begin-sugar-exp`
[meta-lisp.meta] `parse-exp` -- handle `qualified-var-exp` on `symbol-sexp`

# evaluate

[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# feature complete

[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- complete
