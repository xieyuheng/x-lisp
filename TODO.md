[meta-lisp.js] `DesugarPass`
[meta-lisp.js] `ClaimPass`

[meta-lisp.js] add back `(let)` and `(let*)` -- to avoid using `(begin)` in `(if)`
[meta-lisp.js] add `Let` and `LetStar` to `Exp`
[meta-lisp.js] parse `(let)` and `(let*)`

[meta-lisp.js] `DesugarPass` -- desugar `(let*)` to `(let1)`
[meta-lisp.js] `DesugarPass` -- desugar `(let)` to `(let*)` -- take `state` to generate new name

# parse

[meta-lisp.meta] `parse-body` -- `begin-sugar-exp`
[meta-lisp.meta] `parse-exp` -- handle `qualified-var-exp` on `symbol-sexp`

# evaluate

[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# feature complete

[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- complete
