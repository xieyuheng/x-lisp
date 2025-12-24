# symbol

[value] `symbol_t` -- setup
[value] `global_symbol_hash.c`

[lang] `vm_execute_instr` -- `OP_LITERAL_SYMBOL`
[builtin] `compile_token` -- handle quoted symbol
[builtin] `symbol_p`

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
