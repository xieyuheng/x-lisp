# scan call stack

[runtime.c] ambr uintptr_t uint64_t
[basic-lisp.js] setup function table

primitive function to test scan call stack -- print stack trace

- when we have register allocation, before calling stack trace,
  all registers need to be saved to a context object.

# later

[x-lisp-boot.js] `030-ExplicateControlPass` -- compile constant to non-lazy setup code

- if we can ensure all function setup runs before constant setup

  - `define-setup` -- take stage as argument

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

# gc

[runtime.c] `object_spec_t` -- has `get_slot_fn`
[runtime.c] `function_t` -- has register map
