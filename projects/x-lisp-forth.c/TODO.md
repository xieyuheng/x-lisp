# outer interpreter

[builtin] `compile_if`

[lang] `placeholder_t` -- one placeholder has many places to patch
[lang] `mod_t` -- has record of `placeholders`
[lang] `placeholder_patch`
[lang] `mod_define` -- call `placeholder_patch`
[lang] `OP_PLACEHOLDER` -- like `op_t` with `definition` field
[lang] `vm_execute_instr` -- report error on `OP_PLACEHOLDER` -- find placeholder in `vm->mod`

# garbage collection

# builtin structural data

[lang] `vm_execute_instr` -- `OP_LITERAL_STRING`
[lang] `vm_execute_instr` -- `OP_LITERAL_SYMBOL`
[lang] `vm_execute_instr` -- `OP_LITERAL_KEYWORD`

[value] fix `ref_t` -- should be reference to `definition`
[value] remove `function_t`
[value] remove `x_address`

# apply

`@apply`
`@tail-apply`

# module system

# read-execute-loop

[lang] add `read-execute-loop` function to the bottom of the stack
- `read-execute-loop` must NOT be a primitive function
[lang] remove `vm_execute_until`
