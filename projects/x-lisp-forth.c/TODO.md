# keyword

[value] `hashtag` -- setup
[value] `hashtag_t` -- as object
[value] `global_hashtag_record`
[value] `intern_hashtag`
[value] `hashtag_free`
[value] `hashtag_string` & `hashtag_length`
[value] `x_hashtag` & `hashtag_p` & `to_hashtag`
[value] `value_print` -- handle `X_HASHTAG`
[lang] `vm_execute_instr` -- `OP_LITERAL_HASHTAG`
[builtin] `compile_token` -- handle `HASHTAG_TOKEN`
[value] `value_print` -- print as literal value
[builtin] `x_hashtag_p` & `x_hashtag_length`
[builtin] `x_hashtag_to_string` & `x_hashtag_append`

[value] `x_bool` `x_void` `x_null` -- use `hashtag_t`
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
