# xhash

[value] `xhash_t`

# xset

[value] `xset_t`

# total-compare

[gc] `object_class_t` has `compare_fn`
[value] `value_total_compare`
[builtin] `total-compare`
[value] `xhash_t` -- `hash_code` -- use `value_compare`
[value] `xset_t` -- `hash_code` -- use `value_compare`

# circular object

[value] `printer` -- setup -- holding state to support circular object
[value] `value_print` -- all value printing function should take `pointer` as the first argument

# module system
