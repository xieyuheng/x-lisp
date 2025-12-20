# garbage collection

[gc] `vm_gc_roots_in_mod`
[gc] `vm_gc_roots_in_frame_stack`

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
