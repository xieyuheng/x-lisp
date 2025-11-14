[lang] add `PrimitiveFunctionRef` to `Exp`

[basic] add `PrimitiveFunctionRef` to `Value`
[basic] prefix `PrimitiveFunctionRef` with `x_`
[basic] `010-SelectInstructionPass` -- add `PrimitiveFunctionRef` to `Extern` of `machineMod`

[machine] add `Extern` to `Stmt`
[machine] `transpile` -- no prefix for extern name

[runtime] value tag encoding -- copy from inet-lisp
[runtime] builtin
[runtime] GC -- mark and sweep

[basic] `010-SelectInstructionPass` -- `onInstr` -- fix tagged value encoding

[machine] `070-AssignHomePass`
[machine] `080-PatchInstructionPass`
[machine] `090-PrologAndEpilogPass`
