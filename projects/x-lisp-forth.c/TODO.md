[lang] `define_variable_setup` -- for `@var <name> <body> @end`
[lang] `syntax_var` -- call `define_variable_setup`
[lang] var.test.fth

[lang] `interpret_token` -- use `syntax_table` to do dispatch -- instead of a list of if

# xhash

[helpers.c] `array_sort` -- needed by `value_hash_code`
[value] `value_hash_code`
[value] `xhash_t`

# xset

[value] `xset_t`

# circular object

[value] `printer` -- setup -- holding state to support circular object
[value] `value_print` -- all value printing function should take `pointer` as the first argument

# module system
