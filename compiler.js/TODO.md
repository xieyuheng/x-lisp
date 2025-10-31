# frontend

[frontend] `load/` -- setup

[frontend] `CompilePassesCommand` -- call `load`

[frontend] `load/` -- `stage0` -- collect top-level `Compute` to `main` function
[frontend] `load/` -- `stage1` -- `DefineFunction` to `FunctionDefinition`

[frontend] setup test for passes

[pass] `005-shrink`
[pass] `010-uniquify`
[pass] `011-reveal-functions`
[pass] `012-convert-lambdas`
[pass] `020-unnest-operands`
[pass] `030-explicate-control`

# basic SSA

[backend] `aboutSSA` -- `put!` and `use`
[backend] `checkSSA` -- single `use`

# basic type inference

[backend] full type inference

# basic module

[backend] `Stmt` -- `Claim`
[backend] `Stmt` -- `Import`
[backend] `Stmt` -- `Include`

# basic bundling

[backend] `Mod` -- bundle
