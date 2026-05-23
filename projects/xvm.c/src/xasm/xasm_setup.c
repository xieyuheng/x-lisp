#include "index.h"

void xasm_setup(mod_t *mod) {
  xvm_t *xvm = make_xvm(mod);

  record_iter_t iter;
  record_iter_init(&iter, xvm_mod(xvm)->definitions);
  definition_t *definition = record_iter_next_value(&iter);
  while (definition) {
    if (definition->kind == VARIABLE_DEFINITION) {
      assert(!(definition->variable_definition.function &&
               definition->variable_definition.primitive));

      if (definition->variable_definition.primitive) {
        call_primitive_now(xvm, definition->variable_definition.primitive);
        definition->variable_definition.value = xvm_pop(xvm);
      } else if (definition->variable_definition.function) {
        call_function_now(xvm, definition_function(definition));
        definition->variable_definition.value = xvm_pop(xvm);
      }
    }

    definition = record_iter_next_value(&iter);
  }

  xvm_free(xvm);
}
