# basic

[vm] `function_add_label_reference`
[basic] `load_stage1` -- `compile_goto`
[basic] `load_stage1` -- `compile_branch`
[basic] `load_stage1` -- `compile_assign`
[basic] `load_stage1` -- `compile_return`
[basic] `load_stage1` -- `compile_exp`

[basic] `load_stage1` -- (export)
[basic] `load_stage2` -- (import)
[basic] `load_stage3` -- run (main)
[basic] `compile`

# later

[helpers.c] improve `string_builder_t` for `format_*`

[sexp] `format_sexp`
[sexp] `print_sexp`
[sexp] `sexp.snapshot` -- call `print_sexp`
