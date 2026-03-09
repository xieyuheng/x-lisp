# type system

`substApplyToTypeWithBoundIds` -- handle "name-capture" problem

# type system

> infer type for type expressions.

`typeInfer` -- handle `Class`
`typeInfer` -- handle `Tau`
`typeInfer` -- handle `Arrow`
`typeInfer` -- handle `Polymorphic`

# polymorphic type and subtype

persons/luca-cardelli/1985-on-understanding-types-data-abstraction-and-polymorphism.md

`typeCheckByInfer` -- support nested `PolymorphicType`

- be clear about the semantics of `PolymorphicType` (in relationship with subtype)

# pattern match

`Which` as `Exp` -- `typeInfer` like `If`
parse `(which)`
`evaluate` -- supported `Which`

`Match` as `Exp`
parse `(match)`

`desugarMatch` -- compile `(match)` with nested patterns to simple `(match)`
`desugarMatch` -- compile simple `(match)` to `(which)`

# tuple

tuple-cons
tuple-head
tuple-tail

# name of polymorphic type

[maybe] rename `(polymorphic)` to `(nu)`

- because we can say "an exp is polymorphic",
  but we should not say "a type is polymorphic".
