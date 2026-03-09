# type system

`typeGeneralizeInCtx` -- generate pretty bound variable name

more tests from "8 Polymorphic Type-checking"

- from 1987-the-implementation-of-functional-programming-languages.pdf

# type system

> infer type for type expressions.

`typeInfer` -- handle `Class`
`typeInfer` -- handle `Tau`
`typeInfer` -- handle `Arrow`
`typeInfer` -- handle `Polymorphic`

fix `subtype.type-error.lisp`

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
