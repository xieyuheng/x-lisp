# basic

[basic] select-instruction

# runtime

[runtime] value tag encoding
[runtime] GC
[runtime] builtin

# basic

[basic] assign-home
[basic] patch-instruction
[basic] prolog-and-epilog

# later

[machine] `instr-db/` setup

[machine] `instr-db/` support pseudo instructions

- jmp-indirect
- jmp-if -- cc as operand
- jmp-indirect-if -- cc as operand
- branch-if

[compiler] `compileToX86Assembly`
