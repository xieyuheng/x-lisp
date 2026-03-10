# pattern match

`Match` as `Exp`
parse `(match)` & `(match-many)`

rename condLine to condClause
rename matchLine to matchClause

`definitionIsDataConstructor`

`expSubstitute` -- Be careful about the "name-capture" problem.

`simplifyMatch`

`Which` as `Exp`
parse `(which)`

`translateMatchToWhich`
`translateWhichToCond`

`evaluate` -- support `Match` -- by translating all the way to `Cond`

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

`(@object)` -- check repeated keyword
