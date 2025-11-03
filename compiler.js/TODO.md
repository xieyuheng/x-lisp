# backend

[backend] `definePrimitiveFunction`
[backend] remove plugin system -- just use module and definition

[backend] fix `checkBlockTerminator`

[backend] add explicit `(argument)` instr

[backend] add `Curry` to `Value`
[backend] add `Apply` to `instr`

# frontend

[frontend] `020-UnnestOperandPass` -- also unnest atom value -- to use `const` in basic-lisp
[frontend] `030-ExplicateControlPass`

# backend -- SSA

[backend] `aboutSSA` -- `put!` and `use`
[backend] `checkSSA` -- single `use`

# backend -- module

[backend] `Stmt` -- `Import`
[backend] `Stmt` -- `Include`

# backend -- bundling

[backend] `Mod` -- bundle

# compiler

[compiler] `compileMod`
