[helper.c] use `free_fn` instead of `destroy_fn`
[helper.c] debug MEMORY_DEBUG  use `_free` instead of `_destroy`
[helper.c] `MEMORY_DEBUG` use `memory_debug_allocate` and `memory_debug_free`

# scan call stack

[x-lisp-boot.js] `030-ExplicateControlPass` and `031-SetupPrimitiveFunctionPass` -- function metadata has `start`

[runtime.c] `function_metadata_t` -- has `start`

[runtime.c] `x_print_stack_trace` -- to test call stack scan

safepoint compile to `x_print_stack_trace` for now

- TODO when we have register allocation, before calling stack trace,
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
