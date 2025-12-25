[lang] `load` -- call `run` instead of `interpret`

- add an unnamed frame to the bottom of the stack to exit the program
- call `main`

fix tests -- use `@def main` instead of `@begin`

remove `x_begin`
[lang] remove `vm_execute_until`
[lang] remove `call_definition_now`

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
