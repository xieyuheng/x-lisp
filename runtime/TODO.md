[runtime] `x_make_curry`
[runtime] `x_curry_put_mut`

[runtime] `object_t` -- has `equal_fn` and `same_fn` (for immutable object like string)

[runtime] `x_same_p` -- handle immutable `object_t` -- call `same_fn`
[runtime] `x_equal_p` -- handle `object_t` -- call `equal_fn`

[runtime] `curry_t` -- has `equal_fn`

[runtime] `x_unary_apply` -- need to cast to function pointer
[runtime] `x_nullary_apply`

# later

[runtime] gc -- mark and sweep
[runtime] `make_curry` -- use gc

# later

[runtime] `x_write` -- need string

[runtime] `x_random_int`
[runtime] `x_random_float`
