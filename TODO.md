[basic] support `ValueDefinition` -- compiles to many sections

- .bss -- `<name>.const`
- .text -- `<name>.init_function`

[basic] `FunctionDefinition` -- compiles to many sections

- .bss -- `<name>.const`
- .text -- `<name>.function`

`function_t` -- has `address` and `arity` and `is_primitive`

- [maybe] use inline union for `address` to avoid casting

`curry_t` -- has `function_t` instead of `address_t`

in assembly -- global variable can save `function_t`

`object_spec_t` -- has `get_slot_fn`
`function_t` -- has register map

# backup plan

rename runtime to xvm.c
setup sexp.c project
