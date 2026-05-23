#include "index.h"

void xasm_call(mod_t *mod, const char *name, const array_t *args) {
  definition_t *definition = mod_lookup(mod, name);
  if (!definition) {
    who_printf("undefined function\n");
    who_printf("  name: %s\n", name);
    exit(1);
  }

  if (!args && definition_arity(definition) != 0) {
    who_printf("arity mismatch\n");
    who_printf("  name: %s\n", name);
    who_printf("  expected arity: %ld\n", definition_arity(definition));
    who_printf("  given arity: %d\n", 0);
    exit(1);
  }

  if (args && definition_arity(definition) != array_length(args)) {
    who_printf("arity mismatch\n");
    who_printf("  name: %s\n", name);
    who_printf("  expected arity: %ld\n", definition_arity(definition));
    who_printf("  given arity: %ld\n", array_length(args));
    exit(1);
  }

  xvm_t *xvm = make_xvm(mod);

  size_t arity = args ? array_length(args) : 0;

  if (definition->kind == PRIMITIVE_DEFINITION) {
    value_t *locals = allocate(sizeof(value_t) * (arity > 0 ? arity : 1));
    if (args) {
      for (size_t i = 0; i < arity; i++) {
        locals[i] = (value_t) array_get(args, i);
      }
    }
    uint16_t *arg_indices = allocate(sizeof(uint16_t) * (arity > 0 ? arity : 1));
    for (size_t i = 0; i < arity; i++) arg_indices[i] = (uint16_t)i;
    call_primitive(xvm, locals, definition->primitive_definition.primitive,
                   (uint8_t)arity, arg_indices);
    free(arg_indices);
    free(locals);
  } else if (definition->kind == FUNCTION_DEFINITION) {
    value_t *values = allocate(sizeof(value_t) * (arity > 0 ? arity : 1));
    if (args) {
      for (size_t i = 0; i < arity; i++) {
        values[i] = (value_t) array_get(args, i);
      }
    }
    xvm_push_function_frame_with_values(xvm, definition_function(definition),
                                         arity, values);
    free(values);
    xvm->break_depth = xvm->frame_count - 1;
    xvm_execute(xvm);
  } else {
    unreachable();
  }

  xvm_free(xvm);
}
