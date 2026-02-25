# type system

[lisp] `isPolymorphicType`
[lisp] `createPolymorphicType`
[lisp] `polymorphicTypeParameters`
[lisp] `polymorphicTypeClosure`
[lisp] `polymorphicTypeUnfold`

[lisp] `Polymorphic` as `Exp`
[lisp] `evaluate` -- `Polymorphic` -- to `PolymorphicType`
[lisp] `modLookupClaimedType` -- call `polymorphicTypeUnfold`

[lisp] complete `builtin/index.lisp` -- using `(polymorphic)`

# type system

[lisp] `typeInfer` -- support `Let1`
[lisp] `typeInfer` -- support `Begin1`
[lisp] `typeInfer` -- support `BeginSugar`

# pattern match

[diary] about how to implement pattern match

# later

[pass] `desugarCond` -- report `error` about mismatch -- instead of `assert`
