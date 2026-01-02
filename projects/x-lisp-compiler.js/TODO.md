# builtin

[lisp] `importBuiltinMod`
[lisp] `createBuiltinMod` -- use `definePrimitive` -- instead of just a record of entries

[lisp] `Exp` -- add `PrimitiveRef`
[lisp] `Exp` -- remove `attribute` from `FunctionRef` and `ConstantRef`

- fix `revealGlobalVariable`

[lisp] `formatMod` -- should not print `PrimitiveDefinition`

# apply

[lisp] remove `Apply` (binary) and `ApplyNullary` -- keep `ApplySugar`
[lisp] rename `ApplySugar` to `Apply`

# begin

[lisp] add `Begin1` to `Exp` -- generate less names

# forth

[forth] `Stmt`
[forth] `Word`

# compiler

[pass] passes lisp to forth
