[lang] `vm_next_token`
[lang] `vm_top_frame`
[lang] `vm_drop_frame`
[lang] `vm_push_frame`
[lang] `vm_frame_count`
[lang] `vm_value_count`
[lang] `vm_mod`
[lang] hide `vm_t`
[lang] `vm_drop_frame` -- perform gc

# xhash

[value] `value_hash_code`
[value] `xhash_t`

# xset

[value] `xset_t`

# circular object

[value] `printer` -- setup -- holding state to support circular object
[value] `value_print` -- all value printing function should take `pointer` as the first argument

# read-execute-loop

[lang] add `read-execute-loop` function to the bottom of the stack
- `read-execute-loop` must NOT be a primitive function
[lang] remove `vm_execute_until`

# module system
