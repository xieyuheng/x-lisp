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
  value_t *locals = allocate(sizeof(value_t) * (arity > 0 ? arity : 1));

  if (args) {
    for (size_t i = 0; i < arity; i++) {
      locals[i] = (value_t) array_get(args, i);
    }
  }

  if (definition->kind == PRIMITIVE_DEFINITION) {
    uint16_t *arg_indices = allocate(sizeof(uint16_t) * (arity > 0 ? arity : 1));
    for (size_t i = 0; i < arity; i++) arg_indices[i] = (uint16_t)i;
    call_primitive(xvm, locals, definition->primitive_definition.primitive,
                   (uint8_t)arity, arg_indices);
    free(arg_indices);
  } else if (definition->kind == FUNCTION_DEFINITION) {
    uint16_t *arg_indices = allocate(sizeof(uint16_t) * (arity > 0 ? arity : 1));
    for (size_t i = 0; i < arity; i++) arg_indices[i] = (uint16_t)i;
    xvm_push_frame(xvm, make_break_frame());
    xvm_push_frame(xvm, make_function_frame(definition_function(definition),
                                              (uint8_t)arity, arg_indices, locals));
    xvm_execute(xvm);
    free(arg_indices);
  } else {
    unreachable();
  }

  free(locals);
  xvm_free(xvm);
}
