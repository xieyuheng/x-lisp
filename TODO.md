[basic-lisp.js] rename `const` to `value` -- leave space for `define-constant`

[basic-lisp.js] add `ConstantDefinition` to `Definition` -- like `FunctionDefinition` but without arguments
[basic-lisp.js] parse `define-constant`
[basic-lisp.js] `load-constant` instruction

[machine-lisp.js] support `define-space`
[machine-lisp.js] `define-space` -- transpile to .bss

[basic-lisp.js]  `ConstantDefinition` -- compiles to many sections

- `define-space` -- .bss -- `<name>`
- `define-code` -- .text -- `<name>.init_function`

[basic-lisp.js]  `FunctionDefinition` -- compiles to many sections

- `define-space` -- .bss -- `<name>.value`
- `define-code` -- .text -- `<name>`

# runtime

[runtime] `function_t` -- has `address` and `arity` and `is_primitive`

- [maybe] use inline union for `address` to avoid casting

[runtime] `curry_t` -- has `function_t` instead of `address_t`

[runtime] `object_spec_t` -- has `get_slot_fn`
[runtime] `function_t` -- has register map
