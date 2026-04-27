#include "index.h"

static void apply_definition(vm_t *vm, size_t n, definition_t *definition);
static void apply_curry(vm_t *vm, size_t n, curry_t *curry);

void apply(vm_t *vm, size_t n, value_t target) {
  if (definition_p(target)) {
    apply_definition(vm, n, to_definition(target));
  } else if (curry_p(target)) {
    apply_curry(vm, n, to_curry(target));
  } else {
    who_printf("can not apply value: "); print_value(target); newline();
    exit(1);
  }
}

static void supply(vm_t *vm, size_t n, value_t target, size_t arity) {
  assert(n < arity);

  curry_t *curry = make_curry(target, arity - n, n);
  for (size_t i = 0; i < n; i++) {
    curry->args[n - i - 1] = vm_pop(vm);
  }

  vm_push(vm, x_object(curry));
}

void apply_definition(vm_t *vm, size_t n, definition_t *definition) {
  if (!definition_has_arity(definition)) {
    who_printf("definition has no arity: %s\n", definition->name);
    exit(1);
  }

  size_t arity = definition_arity(definition);
  if (n == arity) {
    call_definition_now(vm, definition);
    return;
  } else if (n < arity) {
    supply(vm, n, x_object(definition), arity);
    return;
  } else {
    // args rest-args -- rest-args args
    vm_swap_many(vm, arity, n - arity);
    call_definition_now(vm, definition);
    apply(vm, n - arity, vm_pop(vm));
    return;
  }
}

void apply_curry(vm_t *vm, size_t n, curry_t *curry) {
  if (n == curry->arity) {
    for (size_t i = 0; i < curry->size; i++) {
      vm_push(vm, curry->args[i]);
    }

    // args curried-args -- curried-args args
    vm_swap_many(vm, n, curry->size);
    apply(vm, n + curry->size, curry->target);
    return;
  } else if (n < curry->arity) {
    supply(vm, n, x_object(curry), curry->arity);
    return;
  } else {
    apply_curry(vm, curry->arity, curry);
    apply(vm, n - curry->arity, vm_pop(vm));
    return;
  }
}
