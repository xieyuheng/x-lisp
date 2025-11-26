# module setup code

[basic-lisp.js] `(define-setup-function <name> <block> ...)`
[basic-lisp.js] bundle merge setup code -- order does not matter

# address value

[basic-lisp.js] `Address` as `Value`

# function constant

[x-lisp-boot.js] `ExplicateControlPass` -- setup `FunctionDefinition`

- setup to `make-curry` for now

```scheme
(define-function <name>)
(define-variable _<name>/constant)
(define-setup-function _<name>/setup
  (block body
    (= address (literal (@address <name>)))
    (= arity (literal <arity>))
    (= size (literal 0))
    (= curry (call (@primitive-function make-curry 3) make-curry arity size))
    (store _<name>/constant curry)
    (return)))
```

# function object

[runtime] `function_t` -- has `address` and `arity` and `is_primitive`
[runtime] `curry_t` -- has `function_t` instead of `address_t`
[runtime] `object_spec_t` -- has `get_slot_fn`
[runtime] `function_t` -- has register map

[runtime] [maybe] use inline union for `address` to avoid casting

# setup funtion

[x-lisp-boot.js] `040-SelectInstructionPass` -- literal address instead of literal function
[x-lisp-boot.js] setup funtion to `make-function`

# scan call stack

primitive funtion to test scan call stack -- print stack trace

- when we have register allocation, before calling stack trace,
  all registers need to be saved to a context object.
