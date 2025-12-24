# symbol

[value] `symbol_string`
[value] `symbol_length`

[value] `x_symbol`
[value] `symbol_p`
[value] `to_symbol`

[value] `value_print` -- handle `X_SYMBOL`
[value] `value_equal` -- handle `X_SYMBOL`

[lang] `vm_execute_instr` -- `OP_LITERAL_SYMBOL`
[builtin] `compile_token` -- handle quoted symbol

[builtin] `x_symbol_p`
[builtin] `x_symbol_length`
[builtin] `x_symbol_to_string`
[builtin] `x_symbol_append`

# keyword

[value] `hashtag_t`
[lang] `vm_execute_instr` -- `OP_LITERAL_HASHTAG`
[builtin] `compile_token` -- handle `HASHTAG_TOKEN`
[builtin] `hashtag_p`

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
