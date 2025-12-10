# function

[lang] `struct instr_t instr_decode(void *code)`
[lang] `vm_execute_instr`
[lang] `invoke` handle `FUNCTION_DEFINITION`

# compile

[lang] `interpret_token` -- dispatch to keyword `@define`
[lang] `PLACEHOLDER_DEFINITION` -- setup a placeholder definition for every undefined symbol that we meet

# function as value

[value] fix `function_t` -- should be reference to `definition`

- maybe use `ref_t` instead of `function_t`
- `@ref` vs `@function`

[value] remove `x_address`
