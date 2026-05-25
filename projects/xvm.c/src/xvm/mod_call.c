#include "index.h"

void mod_call_entry(mod_t *mod, const char *name) {
  definition_t *definition = mod_lookup(mod, name);
  if (!definition) {
    who_printf("undefined function\n");
    who_printf("  name: %s\n", name);
    exit(1);
  }

  if (definition_arity(definition) != 0) {
    who_printf("entry function must be 0 arity\n");
    who_printf("  name: %s\n", name);
    who_printf("  arity: %ld\n", definition_arity(definition));
    exit(1);
  }

  xvm_t *xvm = make_xvm(mod);

  if (definition->kind == PRIMITIVE_DEFINITION) {
    value_t *locals = allocate(sizeof(value_t) * 1);
    uint16_t *arg_indices = allocate(sizeof(uint16_t) * 1);
    arg_indices[0] = 0;
    call_primitive(xvm, locals, definition->primitive_definition.primitive, 0, arg_indices);
    free(arg_indices);
    free(locals);
  } else if (definition->kind == FUNCTION_DEFINITION) {
    frame_t *entry = make_function_frame(
      definition_function(definition), 0, NULL, NULL);
    xvm_push_frame(xvm, entry);
    xvm->break_depth = xvm_frame_count(xvm) - 1;
    xvm_execute(xvm);
  } else {
    unreachable();
  }

  xvm_free(xvm);
}
