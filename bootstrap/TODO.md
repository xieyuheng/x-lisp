# basic -- codegen

[basic] `010-SelectInstructionPass` -- `onInstr` -- Const
[basic] `010-SelectInstructionPass` -- `onInstr` -- Assert
[basic] `010-SelectInstructionPass` -- `onInstr` -- Goto
[basic] `010-SelectInstructionPass` -- `onInstr` -- Branch
[basic] `010-SelectInstructionPass` -- `onInstr` -- Call
[basic] `010-SelectInstructionPass` -- `onInstr` -- NullaryApply
[basic] `010-SelectInstructionPass` -- `onInstr` -- Apply


# machine

[machine] `instr-db/` setup

[machine] `instr-db/` support pseudo instructions

- callq-n
- set-if -- cc as operand
- jmp-if -- cc as operand
- branch-if

- jmp-indirect
- jmp-indirect-if -- cc as operand

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
