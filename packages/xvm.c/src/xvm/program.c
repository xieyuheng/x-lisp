#include "index.h"

program_t *make_program(void) {
  program_t *self = new(program_t);
  self->definitions = make_record_with((free_fn_t *) definition_free);
  self->test_names = make_string_set();
  self->entry_name = NULL;
  return self;
}

void program_free(program_t *self) {
  record_free(self->definitions);
  set_free(self->test_names);
  free(self->entry_name);
  free(self);
}

void program_define(program_t *self, const char *name, definition_t *definition) {
  definition_t *found = record_get(self->definitions, name);
  if (found) {
    who_printf("can not redefine name: %s\n", name);
    exit(1);
  }

  record_put(self->definitions, name, definition);
}

definition_t *program_lookup(program_t *self, const char *name) {
  return record_get(self->definitions, name);
}

definition_t *program_lookup_or_fail(program_t *self, const char *name) {
  definition_t *definition = program_lookup(self, name);
  if (definition == NULL) {
    who_printf("undefined name: %s\n", name);
    exit(1);
  }

  return definition;
}
