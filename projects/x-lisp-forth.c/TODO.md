# definition as value

[builtin] `compile_function` -- `@apply` & `@tail-apply` & `@assign`

[lang] `apply_n`

# garbage collection

[gc] `gc/` -- setup
[gc] `gc_t`
[gc] `make_gc`
[gc] `gc_free`
[gc] vm has gc

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
