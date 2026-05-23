#include "index.h"

static void apply_definition(xvm_t *xvm, size_t n, definition_t *definition);
static void apply_curry(xvm_t *xvm, size_t n, curry_t *curry);

void apply(xvm_t *xvm, size_t n, value_t target) {
  xvm_push_root(xvm, target);

  if (definition_p(target)) {
    apply_definition(xvm, n, to_definition(target));
  } else if (curry_p(target)) {
    apply_curry(xvm, n, to_curry(target));
  } else {
    who_printf("unhandled value\n");
    who_printf("  value: "); print_value(target); newline();
    who_printf("  n: %ld\n", n);
    xvm_inspect(xvm);
    exit(1);
  }

  xvm_drop_root(xvm);
}

static void supply(xvm_t *xvm, size_t n, value_t target, size_t arity) {
  assert(n < arity);

  curry_t *curry = make_curry(target, arity - n, n);
  for (size_t i = 0; i < n; i++) {
    curry->args[n - i - 1] = xvm_pop(xvm);
  }

  xvm_push(xvm, x_object(curry));
}

void apply_definition(xvm_t *xvm, size_t n, definition_t *definition) {
  if (!definition_has_arity(definition)) {
    who_printf("definition has no arity: %s\n", definition->name);
    exit(1);
  }

  size_t arity = definition_arity(definition);
  if (n == arity) {
    call_definition_now(xvm, definition);
    return;
  } else if (n < arity) {
    supply(xvm, n, x_object(definition), arity);
    return;
  } else {
    // args rest-args -- rest-args args
    xvm_swap_many(xvm, arity, n - arity);
    call_definition_now(xvm, definition);
    apply(xvm, n - arity, xvm_pop(xvm));
    return;
  }
}

void apply_curry(xvm_t *xvm, size_t n, curry_t *curry) {
  if (n == curry->arity) {
    for (size_t i = 0; i < curry->size; i++) {
      xvm_push(xvm, curry->args[i]);
    }

    // args curried-args -- curried-args args
    xvm_swap_many(xvm, n, curry->size);
    apply(xvm, n + curry->size, curry->target);
    return;
  } else if (n < curry->arity) {
    supply(xvm, n, x_object(curry), curry->arity);
    return;
  } else {
    apply_curry(xvm, curry->arity, curry);
    apply(xvm, n - curry->arity, xvm_pop(xvm));
    return;
  }
}
