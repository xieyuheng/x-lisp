# function

[lang] `function_definition_resize_code_area`

[lang] `instr_length(struct instr_t instr)`
[lang] `instr_length(struct instr_t instr)`
[lang] `void instr_encode(void *code, struct instr_t instr)`
[lang] `struct instr_t instr_decode(void *code)`

[lang] `invoke` handle `FUNCTION_DEFINITION`

# compile

[lang] `execute_token` -- dispatch to keyword `@define`
[lang] `PLACEHOLDER_DEFINITION` -- setup a placeholder definition for every undefined symbol that we meet

# function as value

[value] fix `function_t` -- should be reference to `definition`

- maybe use `ref_t` instead of `function_t`
- `@ref` vs `@function`

[value] remove `x_address`
