rename define-datatype to define-data

# row polymorphism

[maybe] rename InterfaceType to AnonymousInterfaceType

ambr InterfaceType AnonymousInterfaceType
ambr InterfaceType anonymousInterfaceType

`InterfaceType` has `definition`
fix `definitionMeaning` -- return `InterfaceType` instead of `AnonymousInterfaceType`

`DefineInterface` as `Stmt`
parse `(define-interface)`

`prepareDefine` -- handle `DefineInterface`

`InterfaceExtend` as `Exp` -- to support row polymorphism
`AnonymousInterfaceType` add `extend: L.Value` field to support row polymorphism

`Dot` as `Exp`
parse `(:field record)` -- `Dot`
