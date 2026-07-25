#include "index.h"

static void apply_definition(xvm_t *xvm, uint8_t n, const uint16_t *args, value_t *locals,
                              definition_t *definition);
static void apply_closure(xvm_t *xvm, uint8_t n, const uint16_t *args, value_t *locals,
                           closure_t *closure);

void apply(xvm_t *xvm, value_t target, uint8_t argc, const uint16_t *args, value_t *locals) {
  if (definition_p(target)) {
    apply_definition(xvm, argc, args, locals, to_definition(target));
  } else if (closure_p(target)) {
    apply_closure(xvm, argc, args, locals, to_closure(target));
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
  if (n != arity) {
    who_printf("arity mismatch for definition: %s\n", definition->name);
    who_printf("  expected: %zu, got: %d\n", arity, n);
    xvm_inspect(xvm);
    exit(1);
  }

  if (definition->kind == PRIMITIVE_DEFINITION) {
    call_primitive(xvm, locals, definition->primitive_definition.primitive, n, args);
  } else {
    call_function_now_values(xvm, definition->function_definition.function, n, args, locals);
  }
}

void apply_closure(xvm_t *xvm, uint8_t n, const uint16_t *args, value_t *locals,
                    closure_t *closure) {
  size_t total = 1 + n;

  value_t temp_locals[total > 0 ? total : 1];
  temp_locals[0] = x_object(closure);
  for (size_t i = 0; i < n; i++) {
    temp_locals[1 + i] = locals[args[i]];
  }

  uint16_t combined_args[total > 0 ? total : 1];
  for (size_t i = 0; i < total; i++) {
    combined_args[i] = i;
  }

  apply(xvm, x_object(closure->definition), total, combined_args, temp_locals);
}
