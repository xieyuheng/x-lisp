[lisp] extract `DependencyTable` type
[lisp] `createDependencyTable`

[lisp] `projectBuild` -- share dependencies
[lisp] `projectTest` -- share dependencies

# type system

[lisp] `typeInfer` -- support `Let1`
[lisp] `typeInfer` -- support `Begin1`
[lisp] `typeInfer` -- support `BeginSugar`

[lisp] `typeEquivalent` support `VarType`
[lisp] `typeSubtype` support `VarType`
[lisp] `extendSubst`
[lisp] `substApplyToType`
[lisp] `unfiyType`
[lisp] `Polymorphic` as `Exp`
[lisp] `evaluate` -- `Polymorphic` introduce new type variables
[lisp] complete `builtin/index.lisp`

# pattern match

# later

[pass] `desugarCond` -- report `error` about mismatch -- instead of `assert`
