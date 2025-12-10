# function

[lang] `vm_execute_instr`
[lang] `vm_execute_step`
[lang] `vm_execute`
[lang] `vm_execute_until`

[lang] `invoke` handle `FUNCTION_DEFINITION` -- call `vm_execute_until`

# placeholder

[lang] `placeholder_t`
[lang] `mod_t` -- has record of `placeholders`

[lang] extract `define`
[lang] `define` -- call `patch_definition`

[lang] `OP_PLACEHOLDER` -- like `op_t` with `definition` field
[lang] `vm_execute_instr` -- report error on `OP_PLACEHOLDER` -- find placeholder in `vm->mod`

# compile

[lang] `interpret_token` -- dispatch to keyword `@define`

# function as value

[value] fix `function_t` -- should be reference to `definition`

- maybe use `ref_t` instead of `function_t`
- `@ref` vs `@function`

[value] remove `x_address`

# read-execute-loop

[lang] add `read-execute-loop` function to the bottom of the stack

- `read-execute-loop` must NOT be a primitive function

[lang] remove `vm_execute_until`
