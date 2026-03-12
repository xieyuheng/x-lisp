[builtin] rename console to file

`Mod` has `path` instead of `url`

`project:test-by-interpreter` command -- capture output of builtin function
`project:check` command -- capture output of type check report -- improve `snapshot-type-error.sh`

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
