# tael

[value] `make_tael`
[value] `tael_free` -- shallow

[value] `tael_t` -- gc interface

test gc

# symbol and keyword

[value] `symbol_t`
[value] `keyword_t`

[lang] `vm_execute_instr` -- `OP_LITERAL_SYMBOL`
[lang] `vm_execute_instr` -- `OP_LITERAL_KEYWORD`

[builtin] `compile_token` -- handle `KEYWORD_TOKEN`

# feature complete

[value] `value_hash_code`

[value] `xhash_t`
[value] `xset_t`

# read-execute-loop

[lang] add `read-execute-loop` function to the bottom of the stack
- `read-execute-loop` must NOT be a primitive function
[lang] remove `vm_execute_until`

# module system
