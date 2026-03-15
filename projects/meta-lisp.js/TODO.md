# type system

> infer type for type expressions.

`typeInfer` -- handle `Tau`
`typeInfer` -- handle `Arrow`
`typeInfer` -- handle `Polymorphic`

fix `subtype-[1|2].type-error.lisp` -- should not use `(exempt point-t)`

# bug

study coinduction

`typeUnify` -- take `trace` to avoid infinite loop

- test by two definition of `exp-t`

support recursive interface type -- be symmetric with datatype

# row polymorphism

`(@object)` & `(@interface)` -- check repeated keyword
`InterfaceType` support row polymorphism

`Dot` as `Exp`
parse `(:field object)` -- `Dot`

[maybe] `(object-merge lhs rhs)`
