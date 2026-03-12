# pattern match

`DataConstructor` has `DatatypeDefinition`
`DatatypeConstructor` has `DatatypeDefinition`

`simplifyMatch` -- `groupClauseByHeadDataConstructor`
`simplifyMatch` -- `groupClauseByHeadPatternKind`

`simplifyMatch` -- avoid evaluating `targets` many times by `Let1`
`simplifyMatch` -- compile to `Cond` instead of `Match`

`desugar` -- call `simplifyMatch` to handle `Match`

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
