# outer interpreter

setup `builtin/` -- `newline`
`builtin/` -- `newline` -- to test outer interpreter
rename `execute` to `vm_run`

# vm

[core] `instr_t`

- there should be no value in `instr_t`,
  so that GC root scaning no need to scan instructions.

[core] `instr_size(instr)`
[core] `instr_encode(program)`
[core] `instr_decode(program)`

[core] [maybe] `placeholder_t`

- maybe we should setup a placeholder definition for every symbol that we meet
- [core] `mod` -- have `placeholders` -- for patching undefined names

# value

[value] fix `function_t` -- should be reference to `definition`

- maybe use `ref_t` instead of `function_t`
- `@ref` vs `@function`

[value] remove `address_t`

# define

[lang] `execute_token` -- dispatch to keyword `@define`

# sexp

[sexp] port sexp.js

- support comment this time
- with router like api

# cicada-forth

x-forth with chinese syntax keywords
