#include "index.h"

void li_call(mod_t *mod, const char *name) {
  definition_t *definition = mod_lookup(mod, name);
  if (!definition) {
    who_printf("undefined function: %s\n", name);
    exit(1);
  }

  vm_t *vm = make_vm(mod);
  call_definition_now(vm, definition);
  vm_free(vm);
}
