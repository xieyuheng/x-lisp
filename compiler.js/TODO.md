add Let to Exp
add Begin (binary version) to Exp

[pass] `005-shrink` -- handle `BeginSugar`
[pass] `005-shrink` -- handle `AssignSugar` in `BeginSugar`

[pass] `010-uniquify` -- `uniquifyExp`

# frontend

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
