move ts code to compiler/
setup runtime/ -- copy from eoc

# compiler frontend

[frontend] `exp/` -- fresh start
[frontend] `mod/` -- fresh start
[frontend] `definition/` -- fresh start

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
