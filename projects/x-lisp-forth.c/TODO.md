# xhash

[builtin] x_hash_copy
[builtin] x_hash_get
[builtin] x_hash_has_p
[builtin] x_hash_put_mut
[builtin] x_hash_put
[builtin] x_hash_delete_mut
[builtin] x_hash_delete
[builtin] x_hash_keys
[builtin] x_hash_values
[builtin] x_hash_entries

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
