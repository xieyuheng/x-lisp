#include "index.h"

void stk_setup(mod_t *mod) {
  vm_t *vm = make_vm(mod);

  record_iter_t iter;
  record_iter_init(&iter, vm_mod(vm)->definitions);
  definition_t *definition = record_iter_next_value(&iter);
  while (definition) {
    if (definition->kind == VARIABLE_DEFINITION) {
      assert(!(definition->variable_definition.function &&
               definition->variable_definition.primitive));

      if (definition->variable_definition.primitive) {
        call_primitive_now(vm, definition->variable_definition.primitive);
        definition->variable_definition.value = vm_pop(vm);
      } else if (definition->variable_definition.function) {
        call_function_now(vm, definition_function(definition));
        definition->variable_definition.value = vm_pop(vm);
      }
    }

    definition = record_iter_next_value(&iter);
  }

  vm_free(vm);
}
