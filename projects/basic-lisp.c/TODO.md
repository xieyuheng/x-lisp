# basic

[basic] `load_stage1` -- `compile_var`
[basic] `load_stage1` -- `compile_literal`
[basic] `load_stage1` -- `compile_apply`
[basic] `load_stage1` -- `compile_tail_exp`

[basic] `load_stage1` -- (export)
[basic] `load_stage2` -- (import)
[basic] `load_stage3` -- run (main)
[basic] `compile`

# later

[helpers.c] improve `string_builder_t` for `format_*`

[sexp] `format_sexp`
[sexp] `print_sexp`
[sexp] `sexp.snapshot` -- call `print_sexp`
