# row polymorphism

`formatType` & `formatTypeInMod` -- handle `DefinedInterfaceType`
`substApplyToType` -- handle `DefinedInterfaceType`
`typeFreshen` -- handle `DefinedInterfaceType`
`typeVarOccurredInType` -- handle `DefinedInterfaceType`
`typeBisimilar` -- handle `DefinedInterfaceType`
`typeFreeVarTypes` -- handle `DefinedInterfaceType`
`typeSubtype` -- handle `DefinedInterfaceType`
`typeUnify` -- handle `DefinedInterfaceType`

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
