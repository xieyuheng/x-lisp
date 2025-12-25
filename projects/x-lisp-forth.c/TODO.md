fix `@var` syntax -- use `@var <name> <body> @end`

fix var.test.fth

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
