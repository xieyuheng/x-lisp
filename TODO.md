[machine-lisp.js] `Function` as `Operand` -- `Label` should always be local

# scan call stack

[runtime.c] `debug/` -- `x_print_stack_trace` -- setup

[runtime.c] `gc/` -- setup
[runtime.c] `x_gc_required_p` -- setup
[runtime.c] `x_gc_collect` -- -- call `x_print_stack_trace`

[x-lisp-boot.js] `090-PrologAndEpilogPass` -- prolog jump to first block instead of `body`

[basic-lisp.js] add `gc-check` and `gc-collect` block to every function

- `gc-check` -- call `x_gc_required_p`

- `gc-collect` -- call `x_gc_collect`

  TODO `gc-collect` when we have register allocation, before calling stack trace,
  all registers need to be saved to a context object.

[runtime.c] `x_print_stack_trace`

# debug in c

[helper.c] `memory` -- set `MEMORY_DEBUG` will use `memory_debug_allocate` and `memory_debug_free`

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

# maybe -- about literal curry

[x-lisp-boot.js] add `Curry` back to `Exp` -- fix all passes

- because make-curry might be hard to optimize

[x-lisp-boot.js] `040-SelectInstructionPass` -- `selectLiteral` -- handle curry

- but it will be not symmetrical to `(literal (@function ...))`,
  which is compiled to variable reference.

# gc

[runtime.c] `object_spec_t` -- has `get_slot_fn`
[runtime.c] `function_t` -- has register map
