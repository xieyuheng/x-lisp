[basic] rename plugin functions to `definePureInstr` and `defineControlFlowInstr`
[basic] `definePureInstr` -- error report when there is not `dest`
[basic] `defineEffectInstr` -- for `print` and `assert`
[basic] remove `Void` from `Value`

[basic] `checkBlock` -- only end with terminator instruction

# basic SSA

[basic] `aboutSSA` -- `put!` and `use`
[basic] `checkSSA` -- single `use`

# basic type inference

[basic] full type inference

# basic module

[basic] `Stmt` -- `Claim`
[basic] `Stmt` -- `Import`
[basic] `Stmt` -- `Include`

# basic bundling

[basic] `Mod` -- bundle
