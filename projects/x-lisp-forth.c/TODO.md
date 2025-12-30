# xhash

curry_child_iter_next_value
tael_child_iter_next_value
xhash_child_iter_next_value
xhash_child_iter_next

fix `tael_equal` handle null the right way
fix `hash_equal` handle null the right way

# xset

[value] `xset_t`

# total-compare

[gc] `object_class_t` has `compare_fn`

[value] `value_total_compare`
[builtin] `total-compare`

[value] `xhash_t` -- `xhash_hash_code` -- use `value_compare`
[value] `xset_t` -- `xset_hash_code` -- use `value_compare`

# circular object

[value] `printer` -- setup -- holding state to support circular object
[value] `value_print` -- all value printing function should take `pointer` as the first argument

# module system
