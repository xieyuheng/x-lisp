# type system

[lisp] `The` as `Exp`

[lisp] `(define-type)` -- like `(define)` but no need `(claim)`
[lisp] `stageTypeCheck` -- every `(define)` need a `(claim)`

# type system

[lisp] `typeEquivalent` support `VarType`
[lisp] `typeSubtype` support `VarType`

`Subst`
`emptySubst`
`extendSubst`

`substApplyToType`

`unfiyType`

[lisp] `Polymorphic` as `Exp`

[lisp] `evaluate` -- `Polymorphic` introduce new type variables

# later

[lisp] parse simple `(quote)` to `Symbol` `Exp`
[lisp] `projectInterpret` -- handle dependencies

# pattern match

# later

[pass] `desugarCond` -- report `error` about mismatch -- instead of `assert`
