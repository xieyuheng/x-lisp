# codegen

[machine] `Arity` as `Operand`

[basic] `010-SelectInstructionPass` -- `onInstr` -- Call
[basic] `010-SelectInstructionPass` -- `onInstr` -- NullaryApply
[basic] `010-SelectInstructionPass` -- `onInstr` -- Apply

[machine] transpile -- callq-with-arity -- take arity
[machine] transpile -- set-if -- take cc
[machine] transpile -- jmp-if -- take cc
[machine] transpile -- branch-if
[machine] transpile -- jmp-indirect
[machine] transpile -- jmp-indirect-if -- take cc

[runtime] value tag encoding
[runtime] GC
[runtime] builtin

[basic] `010-SelectInstructionPass` -- `onInstr` -- fix tagged value encoding

[machine] `070-AssignHomePass`
[machine] `080-PatchInstructionPass`
[machine] `090-PrologAndEpilogPass`

# later

[compiler] `compileToX86Assembly`
