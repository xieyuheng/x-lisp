# simple load

`definitionClaim`
`definitionCheck` -- call `definitionClaim`
`definitionMeaning` -- call `definitionCheck`

refactor `definitionClaim`

# simple load

`builtinType` -- remove builtin type from builtin/index.lisp
`prepareCode` -- `setupVariable` after `performTypeCheck`

should not call `setupVariable` `setupClaim` `performTypeCheck` in `prepareCode`

- prepare
- setup define-type
- setup claim
- perform type check
- setup variable

`modLookupClaimedType` -- be explicit about `evaluate` of claimed `Exp`

# desugar

`evaluate` -- should not call `desugar`
`desugar` -- should take `mod`

# pattern match

`Match` as `Exp`
parse `(match)` & `(match-many)` -- to `Match`
`definitionIsDataConstructor`
`simplifyMatch`
`Which` as `Exp`
parse `(which)`
`translateMatchToWhich`
`translateWhichToCond`

# type system

more tests from "8 Polymorphic Type-checking"
- from 1987-the-implementation-of-functional-programming-languages.pdf

# type system

> infer type for type expressions.

`typeInfer` -- handle `Class`
`typeInfer` -- handle `Tau`
`typeInfer` -- handle `Arrow`
`typeInfer` -- handle `Polymorphic`

fix `subtype.type-error.lisp`

# tuple

tuple-cons
tuple-head
tuple-tail

# syntax

`(@object)` & `(@class)` -- check repeated keyword
