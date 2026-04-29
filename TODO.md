[meta-lisp.js] `ClaimPass`
[meta-lisp.js] `DesugarPass`
[meta-lisp.js] `LocatePass`
[meta-lisp.js] `QualifyPass`
[meta-lisp.js] `CheckPass`

[meta-lisp.js] add back `(let)` and `(let*)` -- to avoid using `(begin)` in `(if)`
[meta-lisp.js] add `Let` and `LetStar` to `Exp`
[meta-lisp.js] parse `(let)` and `(let*)`
[meta-lisp.js] desugar `(let*)` to `(let1)`
[meta-lisp.js] desugar `(let)` to `(let*)`

# parse

[meta-lisp.meta] `parse-body` -- `begin-sugar-exp`
[meta-lisp.meta] `parse-exp` -- handle `qualified-var-exp` on `symbol-sexp`

# evaluate

[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# feature complete

[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- complete
