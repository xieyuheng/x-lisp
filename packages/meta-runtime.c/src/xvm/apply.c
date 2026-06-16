#include "index.h"

static void supply(xvm_t *xvm, value_t target, size_t arity,
                   uint8_t argc, const uint16_t *args, value_t *locals) {
  assert(argc < arity);

  curry_t *curry = make_curry(target, arity - argc, argc);
  for (size_t i = 0; i < argc; i++) {
    curry->args[i] = locals[args[i]];
  }

  xvm->result = x_object(curry);
}

static void apply_definition(xvm_t *xvm, uint8_t n, const uint16_t *args, value_t *locals,
                              definition_t *definition);
static void apply_curry(xvm_t *xvm, uint8_t n, const uint16_t *args, value_t *locals,
                         curry_t *curry);

void apply(xvm_t *xvm, value_t target, uint8_t argc, const uint16_t *args, value_t *locals) {
  if (definition_p(target)) {
    apply_definition(xvm, argc, args, locals, to_definition(target));
  } else if (curry_p(target)) {
    apply_curry(xvm, argc, args, locals, to_curry(target));
  } else {
    who_printf("unhandled value\n");
    who_printf("  value: "); print_value(target); printf("\n");
    who_printf("  n: %d\n", argc);
    xvm_inspect(xvm);
    exit(1);
  }
}

void apply_definition(xvm_t *xvm, uint8_t n, const uint16_t *args, value_t *locals,
                       definition_t *definition) {
  if (!definition_has_arity(definition)) {
    who_printf("definition has no arity: %s\n", definition->name);
    exit(1);
  }

  size_t arity = definition_arity(definition);
  if (n == arity) {
    if (definition->kind == PRIMITIVE_DEFINITION) {
      call_primitive(xvm, locals, definition->primitive_definition.primitive, n, args);
    } else {
      call_function_now_values(xvm, definition->function_definition.function, n, args, locals);
    }
    return;
  } else if (n < arity) {
    supply(xvm, x_object(definition), arity, n, args, locals);
    return;
  } else {
    if (definition->kind == PRIMITIVE_DEFINITION) {
      call_primitive(xvm, locals, definition->primitive_definition.primitive,
                     (uint8_t)arity, args);
    } else {
      call_function_now_values(xvm, definition->function_definition.function,
                               (uint8_t)arity, args, locals);
    }
    apply(xvm, xvm->result, n - arity, args + arity, locals);
    return;
  }
}

void apply_curry(xvm_t *xvm, uint8_t n, const uint16_t *args, value_t *locals,
                  curry_t *curry) {
  if (n == curry->arity) {
    // VLA[0] is UB in C, so ensure at least 1 element
    value_t temp_locals[(n + curry->size) > 0 ? (n + curry->size) : 1];
    for (size_t i = 0; i < curry->size; i++) {
      temp_locals[i] = curry->args[i];
    }
    for (size_t i = 0; i < n; i++) {
      temp_locals[curry->size + i] = locals[args[i]];
    }

    // VLA[0] is UB in C, so ensure at least 1 element
    uint16_t combined_args[(n + curry->size) > 0 ? (n + curry->size) : 1];
    for (size_t i = 0; i < n + curry->size; i++) {
      combined_args[i] = i;
    }

    apply(xvm, curry->target, n + curry->size, combined_args, temp_locals);
    return;
  } else if (n < curry->arity) {
    supply(xvm, x_object(curry), curry->arity, n, args, locals);
    return;
  } else {
    apply_curry(xvm, curry->arity, args, locals, curry);
    apply(xvm, xvm->result, n - curry->arity, args + curry->arity, locals);
    return;
  }
}
