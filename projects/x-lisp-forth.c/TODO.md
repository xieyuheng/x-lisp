[instr] remove `OP_LITERAL_INT` & `OP_LITERAL_FLOAT`

# record

[builtin] `record` -- setup -- use `symbol` as key
[builtin] `x_make_record`

# xhash

[value] `value_hash_code`
[value] `xhash_t`

# xset

[value] `xset_t`

# circular object

[value] `printer` -- holding state to support circular object

# read-execute-loop

[lang] add `read-execute-loop` function to the bottom of the stack
- `read-execute-loop` must NOT be a primitive function
[lang] remove `vm_execute_until`

# module system
