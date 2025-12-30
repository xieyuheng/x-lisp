# xset

[builtin] `x_set_add_mut`
[builtin] `x_set_add`
[builtin] `x_set_delete_mut`
[builtin] `x_set_delete`
[builtin] `x_set_clear_mut`
[builtin] `x_set_union`
[builtin] `x_set_inter`
[builtin] `x_set_difference`
[builtin] `x_set_subset_p`
[builtin] `x_set_disjoint_p`
[builtin] `x_set_to_list`

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
