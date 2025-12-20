# garbage collection

[gc] `gc_t` -- has `allocated_objects` (`array_t`)
[gc] `gc_t` -- has `gray_object_stack` (`stack_t`)

[gc] `gc_init_roots`

[gc] `gc_mark`
[gc] `gc_sweep`

[gc] `make_gc`
[gc] `gc_free`
[gc] vm has gc

# builtin structural data

[value] `xstring_t`

- let type be prefixed by x, so that it is scalable
- we can have xstring, xhash, xset and so on

[lang] `vm_execute_instr` -- `OP_LITERAL_STRING`
[lang] `vm_execute_instr` -- `OP_LITERAL_SYMBOL`
[lang] `vm_execute_instr` -- `OP_LITERAL_KEYWORD`

# feature complete

# module system

# read-execute-loop

[lang] add `read-execute-loop` function to the bottom of the stack
- `read-execute-loop` must NOT be a primitive function
[lang] remove `vm_execute_until`
