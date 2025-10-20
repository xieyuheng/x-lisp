# basic

[basic] `Mod`

- Mod
  - Def
    - FnDef
      - Block
        - Instr

[basic] `Stmt` -- `Define` -- only define function

- Stmt
  - Define
    - Instr

[basic] `Instr` -- including label

[basic] `Operand` -- `Label` -- symbol start with `.` -- `.label`
[basic] `Operand` -- `Var` -- can local name or function name

[basic] `Type` -- just simple type for now
[basic] `Value`

[basic] plugin system -- for extensions -- learn from vite API

# later

[basic] `Stmt` -- `Import`

[basic] `Mod` -- need bundler before codegen

- review Module system from EOPL
