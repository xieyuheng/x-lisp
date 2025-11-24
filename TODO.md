[machine-lisp.js] move passes/ to top level
[machine-lisp.js] move transpile to top level passes/

[x-lisp-boot.js] compile `(define <name>)` to `(define-variable <name>)` and init-function
[x-lisp-boot.js] call init-function of variable in main
[x-lisp-boot.js] `RevealGlobalVariablePass`

[basic-lisp.js] add `VariableDefinition` to `Definition` -- like `FunctionDefinition` but without arguments
[basic-lisp.js] parse `define-variable`
[basic-lisp.js] `load` and `store` instruction -- for variable? for pointer?

[machine-lisp.js] support `define-space`
[machine-lisp.js] `define-space` -- transpile to .bss

[basic-lisp.js]  `VariableDefinition` -- compiles to many sections

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
