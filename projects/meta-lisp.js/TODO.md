# type checking

[lisp] `typeCheck` -- handle `Tuple`
[lisp] `typeCheck` -- handle `Object`

[lisp] `typeInfer` -- handle `Tuple`
[lisp] `typeInfer` -- handle `Object`

# cond

[lisp] `(cond)` should not be desugared to `(assert false)` -- use `(error)` instead
[lisp] `desugar` -- keep `meta` of `Exp`

# pattern match

compile `(match)` to `(which)`

# tuple

tuple-cons
tuple-head
tuple-tail
