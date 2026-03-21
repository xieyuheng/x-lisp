# row polymorphism

`DefineInterface` as `Stmt`
parse `(define-interface)`
`prepareDefine` -- handle `DefineInterface`

`ExtendInterface` as `Exp` -- to support row polymorphism

`formatType` & `formatTypeInMod` -- handle `ExtendInterfaceType`
`substApplyToType` -- handle `ExtendInterfaceType`
`typeFreshen` -- handle `ExtendInterfaceType`
`typeVarOccurredInType` -- handle `ExtendInterfaceType`
`typeBisimilar` -- handle `ExtendInterfaceType`
`typeFreeVarTypes` -- handle `ExtendInterfaceType`
`typeSubtype` -- handle `ExtendInterfaceType`
`typeUnify` -- handle `ExtendInterfaceType`

`Dot` as `Exp`
parse `(:field record)` -- `Dot`
