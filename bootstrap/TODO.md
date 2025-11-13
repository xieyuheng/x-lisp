# codegen

[basic] `010-SelectInstructionPass` -- `onInstr` -- Call
[basic] `010-SelectInstructionPass` -- `onInstr` -- NullaryApply
[basic] `010-SelectInstructionPass` -- `onInstr` -- Apply

# machine

[machine] transpile -- callq-n
[machine] transpile -- set-if -- take cc
[machine] transpile -- jmp-if -- take cc
[machine] transpile -- branch-if
[machine] transpile -- jmp-indirect
[machine] transpile -- jmp-indirect-if -- take cc

# machine

[machine] `070-AssignHomePass`
[machine] `080-PatchInstructionPass`
[machine] `090-PrologAndEpilogPass`

# runtime

[runtime] value tag encoding
[runtime] GC
[runtime] builtin

# later

[compiler] `compileToX86Assembly`
