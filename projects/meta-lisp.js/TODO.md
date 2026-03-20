[diary] simple row polymorphic can not handle record-merge

2026-03-20-simple-row-polymorphic-can-not-handle-record-merge.md

we can type `Dot` with row polymorphic type, but how to type `record-merge`?


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
