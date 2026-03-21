# row polymorphism

`DefineInterface` as `Stmt`
parse `(define-interface)`

`prepareDefine` -- handle `DefineInterface`

`InterfaceExtend` as `Exp` -- to support row polymorphism
`AnonymousInterfaceType` add `extend: L.Value` field to support row polymorphism

`Dot` as `Exp`
parse `(:field record)` -- `Dot`
