#include "index.h"

static record_t *symtab = NULL;

void x86_symtab_init(void) {
  symtab = make_record();
}

void x86_symtab_register(const char *name, void *addr) {
  record_put(symtab, name, addr);
}

void *x86_symtab_lookup(const char *name) {
  return record_get(symtab, name);
}

static const char *short_name(const char *full_name) {
  const char *last = strrchr(full_name, '/');
  if (last) return last + 1;
  return full_name;
}

void x86_symtab_populate_from_mod(mod_t *mod) {
  record_iter_t iter;
  record_iter_init(&iter, mod->definitions);
  definition_t *def = record_iter_next_value(&iter);
  while (def) {
    const char *sn = short_name(def->name);
    if (def->kind == PRIMITIVE_DEFINITION) {
      x86_symtab_register(def->name, (void *)(uint64_t)x_object(def));
      x86_symtab_register(sn, (void *)(uint64_t)x_object(def));
    } else if (def->kind == VARIABLE_DEFINITION) {
      x86_symtab_register(def->name, (void *)(uint64_t)def->variable_definition.value);
      x86_symtab_register(sn, (void *)(uint64_t)def->variable_definition.value);
    }
    def = record_iter_next_value(&iter);
  }
}

void x86_symtab_free(void) {
  if (symtab) {
    record_free(symtab);
    symtab = NULL;
  }
}
