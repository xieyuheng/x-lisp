# row polymorphism

`DefineInterface` as `Stmt`
parse `(define-interface)`

`prepareDefine` -- handle `DefineInterface`

`InterfaceType` has optional `definition`
fix `definitionMeaning` -- return `InterfaceType` with `definition`

`InterfaceExtend` as `Exp` -- to support row polymorphism
`InterfaceType` add field to support row polymorphism

`Dot` as `Exp`
parse `(:field record)` -- `Dot`

`(record-merge lhs rhs)`
