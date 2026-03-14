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

# row polymorphism

[maybe] we should use `(@interface)` instead of `(@class)`, because there is not `self` or `this`

`(@object)` & `(@class)` -- check repeated keyword
`ClassType` support row polymorphism

`Dot` as `Exp`
parse `(:field object)` -- `Dot`

[maybe] `(object-merge lhs rhs)`
