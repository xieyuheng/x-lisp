# fix the use of builtin

[basic] `declare-function` instead of `define-primitive-function`
[lisp] setup `builtin/` -- map from x-lisp function to c function -- map name to name and arity
[lisp] generate `declare-function` in basic
[basic] remove `builtin/`

# fix operand of basic-lisp

[basic] should have ADT `Operand` instead of just variable name

# global label (function and variable) vs. local label

[machine] rename `Label` to `LocalLabel`
[machine] `Label` as global label
[lisp] `040-SelectInstructionPass` -- `selectFunctionLabel` & `selectAddressLabel` -- use `hasBuiltinFunction`
[basic] `qualifyFunction` & `qualifyAddress` -- use `hasBuiltinFunction`
[basic] `FunctionRef` and `Address` have not `attributes`

# scan call stack

as the current design, every builtin function must be callable from x-lisp.

- this does not make sense.
  we need a way to call function that should not be called from x-lisp:

  - `make-function`
  - `make-curry`
  - `gc-collect`

- currently we are limited by the design of basic-lisp,
  the features of which are designed for optimization,
  which we have not used yet.

[x-lisp-runtime.c] `debug/` -- `x_print_stack_trace` -- setup

[x-lisp-runtime.c] `gc/` -- setup
[x-lisp-runtime.c] `x_gc_required_p` -- setup
[x-lisp-runtime.c] `x_gc_save_registers` -- function written in assembly
[x-lisp-runtime.c] `x_gc_collect` -- call `x_print_stack_trace`

[lisp] `090-PrologAndEpilogPass` -- prolog jump to first block instead of `body`

[basic] add `gc-check` and `gc-collect` block to every function

- `gc-check` -- call `x_gc_required_p`

- `gc-collect` -- call `x_gc_collect`

  TODO `gc-collect` when we have register allocation, before calling stack trace,
  all registers need to be saved to a context object.

[x-lisp-runtime.c] `x_print_stack_trace`

# debug in c

[helper.c] `memory` -- set `MEMORY_DEBUG` will use `memory_debug_allocate` and `memory_debug_free`

# later

[lisp] `030-ExplicateControlPass` -- compile constant to non-lazy setup code

- if we can ensure all function setup runs before constant setup

  - `define-setup` -- take stage as argument

# later

[x-lisp-runtime.c] complete builtin

```
x_atom_p
x_write
x_random_int
x_random_float
```

# maybe -- about literal curry

[lisp] add `Curry` back to `Exp` -- fix all passes

- because make-curry might be hard to optimize

[lisp] `040-SelectInstructionPass` -- `selectLiteral` -- handle curry

- but it will be not symmetrical to `(literal (@function ...))`,
  which is compiled to variable reference.

# gc

[x-lisp-runtime.c] `function_t` -- has register map
