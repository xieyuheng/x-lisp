# outer interpreter

[lang] `compile_invoke` -- compile `OP_PLACEHOLDER`, and call `mod_undefined_place` to create placeholder

[lang] `placeholder_patch`
[lang] `mod_define` -- call `placeholder_patch`

test -- order of definition does not matter

# note

ascii note about how @if @else @then is compiled

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
