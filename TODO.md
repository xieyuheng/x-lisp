# basic

[basic] `Value` should not use `number` directly, use `Int` and `Float`

[basic] `Mod`

- just use `string` as label

- Mod
  - Definition
    - FunctionDefinition
      - Block
        - Instr

[basic] `Stmt` -- `Define` -- only define function

- Stmt
  - Define
    - Instr | Label

[basic] parse stmt
[basic] build control flow graph
[basic] `execute` -- mod and function without args
[basic] full type inference
[basic] plugin system -- for extensions -- learn from vite API

# later

[basic] `Stmt` -- `Claim`
[basic] `Stmt` -- `Import`
[basic] `Stmt` -- `Include`
[basic] `Mod` -- bundle
