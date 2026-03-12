# pattern match

`simplifyMatch` -- `groupClausesByHeadPatternKind`

`Which` as `Exp`
parse `(which)`

`simplifyMatch` -- compile to `Which` instead of `Match`

`simplifyMatch` -- avoid evaluating `targets` many times by `Let1`

`desugar` -- call `simplifyMatch` to handle `Match`

# pattern match

[maybe] `DataConstructor` has `DatatypeDefinition`
[maybe] `DatatypeConstructor` has `DatatypeDefinition`

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
