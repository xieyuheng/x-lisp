# fix apply -- for codegen

[basic] `evaluate/` -- `applyNullary`
[basic] `evaluate/` -- `apply` should only take two operands

# basic -- codegen

[basic] `passes/` setup

[basic] `SelectInstructionPass`
[basic] `AssignHomePass`
[basic] `PatchInstructionPass`
[basic] `PrologAndEpilogPass`

# runtime

[runtime] value tag encoding
[runtime] GC
[runtime] builtin

# later

[machine] `instr-db/` setup

[machine] `instr-db/` support pseudo instructions

- jmp-indirect
- jmp-if -- cc as operand
- jmp-indirect-if -- cc as operand
- branch-if

[compiler] `compileToX86Assembly`
