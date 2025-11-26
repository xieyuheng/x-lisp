# define constant

[x-lisp-boot.js] test writing define constant -- `(define <name> <body>)`

[x-lisp-boot.js] `Constant` as `Exp` -- like `Function`
[x-lisp-boot.js] `RevealConstantPass`
[x-lisp-boot.js] compile `Constant` to function call

[x-lisp-boot.js] test using define constant -- `(define <name> <body>)`

# function constant

[basic-lisp.js] `(setup <exp> ...)` every mod have setup code
[basic-lisp.js] bundle merge setup code -- order does not matter

[x-lisp-boot.js] compile `FunctionDefinition` to a `define-variable` and a `define-function` and `(setup)`

- setup to `make-curry` for now

```scheme
(define-variable ©<name>/constant)
(define-function <name>)
```

# `function_t` instead of `curry_t`

[runtime] `function_t` -- has `address` and `arity` and `is_primitive`
- [maybe] use inline union for `address` to avoid casting
[runtime] `curry_t` -- has `function_t` instead of `address_t`
[runtime] `object_spec_t` -- has `get_slot_fn`
[runtime] `function_t` -- has register map

[x-lisp-boot.js] setup funtion to `make-function`

# scan call stack

primitive funtion to test scan call stack -- print stack trace

- when we have register allocation, before calling stack trace,
  all registers need to be saved to a context object.
