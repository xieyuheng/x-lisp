# string

[builtin] `string` -- setup

# record

[builtin] `record` -- setup
[builtin] `x_make_record`

# symbol and keyword

[value] `symbol_t`
[value] `keyword_t`

[lang] `vm_execute_instr` -- `OP_LITERAL_SYMBOL`
[lang] `vm_execute_instr` -- `OP_LITERAL_KEYWORD`

[builtin] `compile_token` -- handle `KEYWORD_TOKEN`

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
