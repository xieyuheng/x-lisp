# type system

`typeGeneralize` -- make polymorphic type from type with free type variables

[maybe] rename `(polymorphic)` to `(nu)`

- because we can say "an exp is polymorphic",
  but we should not say "a type is polymorphic".

`typeInfer` -- infer polymorphic type for `Let`

# type system

`substApplyToTypeWithBoundIds` -- handle "name-capture" problem

- by renaming bound type variables,
  or by limiting bound type variables
  so that they are always different from normal type variables.

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
