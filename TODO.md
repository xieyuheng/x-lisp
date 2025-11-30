# define-metadata

[basic-lisp.js] `formatMetadata`
[basic-lisp.js] `formatDefinition` -- handle `MetadataDefinition`
[basic-lisp.js] `DefineMetadata`
[basic-lisp.js] parse `(define-metadata)`

[basic-lisp.js] `execute` -- deref `Address` to metadata
[basic-lisp.js] test metadata by `execute`

[x-lisp-boot.js] `040-SelectInstructionPass` -- translate `B.MetadataDefinition` to `M.DataDefinition`

# function object

[runtime.c] `function_t` -- has `address` and `arity` and `is_primitive`
[runtime.c] `curry_t` -- has `function_t` instead of `address_t`
[runtime.c] `object_spec_t` -- has `get_slot_fn`
[runtime.c] `function_t` -- has register map

[runtime.c] [maybe] use inline union for `address` to avoid casting

# function constant

[x-lisp-boot.js] `ExplicateControlPass` -- setup `FunctionDefinition` to `make-function`

```scheme
(define-function <name>)

(define-metadata <name>©metadata
  :arity <arity>
  :name "<name>"
  :variable-count ...
  :variable-names [...]
  :register-info <name>©register-info)

(define-variable <name>©constant)

(define-setup <name>©setup
  (block body
    (= address (literal (@address <name>)))
    (= metadata (literal (@address <name>©metadata)))
    (= function (call (@primitive-function make-function 2) address metadata))
    (store <name>©constant function)
    (return)))
```

# scan call stack

primitive funtion to test scan call stack -- print stack trace

- when we have register allocation, before calling stack trace,
  all registers need to be saved to a context object.

# later

[x-lisp-boot.js] `030-ExplicateControlPass` -- compile constant to non-lazy setup code

- if we can ensure all function setup runs before constant setup

  - `define-setup` -- take stage as argument

[x-lisp-boot.js] `encodeValue` -- need sexp.js to really support js `bigint`

# later

[runtime.c] complete builtin

```
x_atom_p
x_write
x_random_int
x_random_float
```

# maybe

[x-lisp-boot.js] add `Curry` back to `Exp` -- fix all passes
[x-lisp-boot.js] `040-SelectInstructionPass` -- `selectLiteral` -- handle curry

# xvi

xvi.c -- setup c project

# xth

xth.c -- setup c project
xth.c -- port code from xvm
