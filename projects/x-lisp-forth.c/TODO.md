# xstring

[value] `xstring_equal`
[value] `xstring_print`

[lang] `vm_execute_instr` -- `OP_LITERAL_STRING`

# curry

[value] fix `curry_t` for gc

# tael

[value] `tael_t` -- setup
[value] `make_tael`
[value] `tael_free` -- shallow

test gc

# symbol and keyword

[value] `symbol_t`
[value] `keyword_t`

[lang] `vm_execute_instr` -- `OP_LITERAL_SYMBOL`
[lang] `vm_execute_instr` -- `OP_LITERAL_KEYWORD`

# feature complete

[value] `value_hash_code`

[value] `xhash_t`
[value] `xset_t`

# read-execute-loop

[lang] add `read-execute-loop` function to the bottom of the stack
- `read-execute-loop` must NOT be a primitive function
[lang] remove `vm_execute_until`

# module system
