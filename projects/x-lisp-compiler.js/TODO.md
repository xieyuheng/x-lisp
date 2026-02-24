# type system

[lisp] `isDatatypeType`
[lisp] `createDatatypeType`
[lisp] `datatypeTypeDatatypeDefinition`
[lisp] `datatypeTypeArgTypes`

[lisp] `isDisjointUnionType`
[lisp] `createDisjointUnionType`
[lisp] `disjointUnionTypeVariantRecord`

[lisp] `unfoldDatatypeType`

[lisp] remove `DatatypeValue` & `DisjointUnionValue`

[lisp] `substApplyToType`
[lisp] `extendSubst`

[lisp] `unfiyType`

[lisp] `Polymorphic` as `Exp`
[lisp] `evaluate` -- `Polymorphic` introduce new type variables

[lisp] `typeEquivalent` support `VarType` -- maybe need take `subst` as state
[lisp] `typeSubtype` support `VarType` -- maybe need take `subst` as state

[lisp] complete `builtin/index.lisp` -- using `(polymorphic)`

# type system

[lisp] `typeInfer` -- support `Let1`
[lisp] `typeInfer` -- support `Begin1`
[lisp] `typeInfer` -- support `BeginSugar`

# pattern match

[diary] about how to implement pattern match

# later

[pass] `desugarCond` -- report `error` about mismatch -- instead of `assert`
