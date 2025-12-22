# tael

[value] `make_tael_child_iter` -- compose `record_iter`

- remove `tael_first_child`
- fix `tael_next_child`

[gc] iter can be used without `*_iter_init` -- instead of `make_*_iter` + `*_iter_free`

[builtin] `tael` -- setup

[forth] tael.test.fth

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
