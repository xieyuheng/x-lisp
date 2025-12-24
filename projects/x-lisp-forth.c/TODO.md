[gc] init_global_gc
[value] init_constant_value

# keyword

[value] `x_bool` `x_null` -- use `hashtag_t`
[value] remove `little`

# record

[builtin] `record` -- setup
[builtin] `x_make_record`

# circular object

[value] `tael_print` -- support circular
[value] `curry_print` -- support circular

# feature complete

[value] `value_hash_code`

[value] `xhash_t`
[value] `xset_t`

# read-execute-loop

[lang] add `read-execute-loop` function to the bottom of the stack
- `read-execute-loop` must NOT be a primitive function
[lang] remove `vm_execute_until`

# module system
