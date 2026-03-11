# desugar

`definitionDesugar` -- handle `DatatypeDefinition`

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
