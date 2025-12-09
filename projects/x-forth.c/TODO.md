# vm

[lang] `instr_t`

- there should be no value in `instr_t`,
  so that GC root scaning no need to scan instructions.

[lang] `instr_size(instr)`
[lang] `instr_encode(program)`
[lang] `instr_decode(program)`

[lang] `invoke` handle `FUNCTION_DEFINITION`

# value

[value] fix `function_t` -- should be reference to `definition`

- maybe use `ref_t` instead of `function_t`
- `@ref` vs `@function`

[value] remove `x_address`

# compile

[lang] `execute_token` -- dispatch to keyword `@define`
[lang] `PLACEHOLDER_DEFINITION` -- setup a placeholder definition for every undefined symbol that we meet
