# definition as value

`OP_APPLY` & `OP_TAIL_APPLY`
`@apply` & `@tail-apply`
`OP_ASSIGN` -- like `OP_APPLY` -- take definition from stack
`@assign`

# garbage collection

# builtin structural data

[lang] `vm_execute_instr` -- `OP_LITERAL_STRING`
[lang] `vm_execute_instr` -- `OP_LITERAL_SYMBOL`
[lang] `vm_execute_instr` -- `OP_LITERAL_KEYWORD`

# feature complete

# module system

# read-execute-loop

[lang] add `read-execute-loop` function to the bottom of the stack
- `read-execute-loop` must NOT be a primitive function
[lang] remove `vm_execute_until`
