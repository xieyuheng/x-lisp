# variable

[x-lisp-boot.js] compile `(define <name> <exp>)` to variable and function
[x-lisp-boot.js] `RevealCachedValuePass`
[x-lisp-boot.js] compile reference to `ValueDefinition` to function call

# function

[basic-lisp.js] every mod have initialization code

[x-lisp-boot.js] `ValueDefinition`
[x-lisp-boot.js] compile `(define <name>)` to `(define-cached-value <name>)`

# runtime

[runtime] `function_t` -- has `address` and `arity` and `is_primitive`
- [maybe] use inline union for `address` to avoid casting
[runtime] `curry_t` -- has `function_t` instead of `address_t`
[runtime] `object_spec_t` -- has `get_slot_fn`
[runtime] `function_t` -- has register map
