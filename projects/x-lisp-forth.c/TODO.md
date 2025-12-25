# record

[builtin] `x_make_record`
[builtin] `x_anything_record_p`
[builtin] `x_record_copy`
[builtin] `x_record_length` & `x_record_empty_p`

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
