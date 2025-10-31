# interpreter

[interpreter] inline `Atom` to `Exp`

# frontend

[frontend] `exp/` -- only lambda calculus for now
[frontend] `value/` -- only lambda calculus for now

[frontend] `stmt/` -- `Define`
[frontend] `stmt/` -- `DefineFunction`
[frontend] `stmt/` -- `Compute`

[frontend] `syntax/` -- `matchStmt`
[frontend] `syntax/` -- `matchExp`

[frontend] `load/` -- collect top-level `Compute` to `main` function

[frontend] setup test for passes

[pass] `shrink`
[pass] `uniquify`
[pass] `reveal-functions`
[pass] `convert-lambdas`
[pass] `unnest-operands`
[pass] `explicate-control`

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
