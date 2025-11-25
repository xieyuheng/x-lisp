# constant

[x-lisp-boot.js] `ConstantDefinition`
[x-lisp-boot.js] `DefineConstant`
[x-lisp-boot.js] parse `(define <name> <exp>)`
[x-lisp-boot.js] compile `ConstantDefinition` to a variable, a flag and a function

```scheme
(define-variable <name>)
(define-variable ©<name>/init-flag)
(define-variable ©<name>/init-function)
```

[x-lisp-boot.js] `RevealConstantPass`
[x-lisp-boot.js] compile `Constant` to function call

# function

[basic-lisp.js] `(setup <exp> ...)` every mod have setup code
[basic-lisp.js] bundle merge setup code -- order does not matter

[x-lisp-boot.js] compile `FunctionDefinition` to a `define-variable` and a `define-function` and `(setup)`

- setup to `make-curry` for now

```scheme
(define-variable ©<name>/constant)
(define-function <name>)
```

# runtime

[runtime] `function_t` -- has `address` and `arity` and `is_primitive`
- [maybe] use inline union for `address` to avoid casting
[runtime] `curry_t` -- has `function_t` instead of `address_t`
[runtime] `object_spec_t` -- has `get_slot_fn`
[runtime] `function_t` -- has register map

[x-lisp-boot.js] setup funtion to `make-function`
