# outer interpreter

setup `builtin/`

`builtin/` -- `int`
`builtin/` -- `float`



`builtin/` -- `console` -- `newline` `print` `println`

`scripts/test.sh` -- test outer interpreter

# vm

[lang] `instr_t`

- there should be no value in `instr_t`,
  so that GC root scaning no need to scan instructions.

[lang] `instr_size(instr)`
[lang] `instr_encode(program)`
[lang] `instr_decode(program)`

[lang] [maybe] `placeholder_t`

- maybe we should setup a placeholder definition for every symbol that we meet
- [lang] `mod` -- have `placeholders` -- for patching undefined names

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
