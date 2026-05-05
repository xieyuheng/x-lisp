#include "index.h"

void stk_call(mod_t *mod, const char *name, const array_t *args) {
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
    who_printf("  expected arity: %ld\n", definition_arity(definition));
    who_printf("  given arity: %ld\n", array_length(args));
    exit(1);
  }

  vm_t *vm = make_vm(mod);

  if (args) {
    for (size_t i = 0; i < array_length(args); i++) {
      value_t arg = (value_t) array_get(args, i);
      vm_push(vm, arg);
    }
  }

  call_definition_now(vm, definition);

  vm_free(vm);
}
