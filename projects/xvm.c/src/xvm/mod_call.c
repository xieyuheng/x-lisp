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
    call_primitive(xvm, NULL, definition->primitive_definition.primitive, 0, NULL);
  } else if (definition->kind == FUNCTION_DEFINITION) {
    xvm_push_function_frame(xvm, definition_function(definition), 0, NULL);
    xvm->break_depth = xvm_frame_count(xvm) - 1;
    xvm_execute(xvm);
  } else {
    unreachable();
  }

  xvm_free(xvm);
}
