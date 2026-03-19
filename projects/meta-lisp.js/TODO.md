# row polymorphism

`InterfaceDefinition` -- to support recursive interface type -- be symmetric with datatype
`DefineInterface` as `Stmt`
parse `(define-interface)`

`InterfaceExtend` as `Exp` -- to support row polymorphism
`InterfaceType` add field to support row polymorphism

`Dot` as `Exp`
parse `(:field record)` -- `Dot`

`(record-merge lhs rhs)`
