`typeCanonicalLabelSubst` -- for `typeReify`
`typeFreshen`
`typeReify` -- to implement `typeInstance`
`typeInstance` -- to implement `typeAssignable`
`typeAssignable` -- be careful about the order of arguments:
- lhs : given type = rhs : inferred type

# pattern match

`Which` as `Exp` -- `typeInfer` like `If`
parse `(which)`
`evaluate` -- supported `Which`

`Match` as `Exp`
parse `(match)`

`desugarMatch` -- compile `(match)` with nested patterns to simple `(match)`
`desugarMatch` -- compile simple `(match)` to `(which)`

# type system

`typeInfer` -- infer polymorphic type for `Let`

# polymorphic type and subtype

persons/luca-cardelli/1985-on-understanding-types-data-abstraction-and-polymorphism.md

`typeCheckByInfer` -- support nested `PolymorphicType`

- be clear about the semantics of `PolymorphicType` (in relationship with subtype)

# tuple

tuple-cons
tuple-head
tuple-tail
