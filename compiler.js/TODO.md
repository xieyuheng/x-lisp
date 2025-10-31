# frontend

[frontend] `load/` -- `stage0` -- collect top-level `Compute` to `main` function
[frontend] `load/` -- `stage1` -- `DefineFunction` to `FunctionDefinition`

[frontend] `compilePasses`

[pass] `005-shrink`
[pass] `010-uniquify`
[pass] `011-reveal-functions`
[pass] `012-convert-lambdas`
[pass] `020-unnest-operands`
[pass] `030-explicate-control`

# later

[frontend] `compileMod`

# basic SSA

[backend] `aboutSSA` -- `put!` and `use`
[backend] `checkSSA` -- single `use`

# basic module

[backend] `Stmt` -- `Import`
[backend] `Stmt` -- `Include`

# basic bundling

[backend] `Mod` -- bundle
