[basic] `pluginDefineEffect` -- for `print` and `assert`
[basic] `pluginDefineInstr` -- error report when there is not `dest`

[basic] remove `Void` from `Value`

[basic]  kinds of instruction

- pure -- with return value
- effect -- no return value
- mixed -- with return value and effect
  - should we disallow this case?
- terminator -- for control flow
- SSA related -- `put!` and `use`

[basic] `checkBlock` -- only end with terminator instruction
[basic] passes -- `eliminate-dead-code`

# basic SSA

[basic] `aboutSSA` -- `put!` and `use`

# basic type inference

[basic] full type inference

# basic module

[basic] `Stmt` -- `Claim`
[basic] `Stmt` -- `Import`
[basic] `Stmt` -- `Include`

# basic bundling

[basic] `Mod` -- bundle
