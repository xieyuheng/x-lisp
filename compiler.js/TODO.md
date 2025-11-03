[backend] merge effect with pure function

# backend

[backend] use AST `Instr` with similar fields -- instead of generic `Instr`

[backend] `Operand` must be `string`

[backend] target of `Call` should be `FunctionRef`
[backend] `definePrimitiveFunction` & `PrimitiveFunctionDefinition`
[backend] remove plugin system -- just use module and definition

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
