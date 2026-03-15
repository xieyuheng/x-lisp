# type system

> more tests about pattern match
more tests about polymorphic type-checking

# type system

> infer type for type expressions.

`typeInfer` -- handle `Interface`
`typeInfer` -- handle `Tau`
`typeInfer` -- handle `Arrow`
`typeInfer` -- handle `Polymorphic`

fix `subtype.type-error.lisp`

# row polymorphism

`(@object)` & `(@interface)` -- check repeated keyword
`InterfaceType` support row polymorphism

`Dot` as `Exp`
parse `(:field object)` -- `Dot`

[maybe] `(object-merge lhs rhs)`

# bug

`typeUnify` -- take `trace` to avoid infinite loop

- test by two definition of `exp-t`

support recursive interface type -- be symmetric with datatype
