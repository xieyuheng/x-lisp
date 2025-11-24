[basic-lisp.js] add `VariableDefinition` to `Definition`
[basic-lisp.js] `define-variable`
[basic-lisp.js]  `VariableDefinition` -- compiles `define-space`
[basic-lisp.js] `load` and `store` instruction -- for variable

[machine-lisp.js] support `define-space`
[machine-lisp.js] `define-space` -- transpile to .bss

[basic-lisp.js] add `CachedValueDefinition` to `Definition` -- like `FunctionDefinition` but without arguments
[basic-lisp.js] parse `define-cached-value`
[basic-lisp.js]  `CachedValueDefinition` -- compiles `define-space` and init function

[x-lisp-boot.js] `ValueDefinition`
[x-lisp-boot.js] compile `(define <name>)` to `(define-cached-value <name>)`

[x-lisp-boot.js] every mod has generated `init` function
[basic-lisp.js] `bundle` should merge `init` functions

[x-lisp-boot.js] `RevealGlobalVariablePass`

# runtime

[runtime] `function_t` -- has `address` and `arity` and `is_primitive`
- [maybe] use inline union for `address` to avoid casting
[runtime] `curry_t` -- has `function_t` instead of `address_t`
[runtime] `object_spec_t` -- has `get_slot_fn`
[runtime] `function_t` -- has register map
