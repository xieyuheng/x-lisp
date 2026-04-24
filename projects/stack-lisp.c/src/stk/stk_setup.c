#include "index.h"

void stk_setup(mod_t *mod) {
  vm_t *vm = make_vm(mod);

  record_iter_t iter;
  record_iter_init(&iter, vm_mod(vm)->definitions);
  definition_t *definition = record_iter_next_value(&iter);
  while (definition) {
    if (definition->kind == VARIABLE_DEFINITION &&
        definition->variable_definition.function) {
      function_t *function = definition_function(definition);
      vm_push_frame(vm, make_function_frame(function));
      vm_execute(vm);
      definition->variable_definition.value = vm_pop(vm);
    }

    definition = record_iter_next_value(&iter);
  }

  vm_free(vm);
}
