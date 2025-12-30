# xset

[value] `xset_add`
[value] `xset_copy`
[value] `xset_delete`
[value] `xset_clear`
[value] `xset_member_p`
[value] `set_union`
[value] `set_inter`
[value] `set_difference`
[value] `set_disjoint_p`

[builtin] `x_any_set_p`

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
