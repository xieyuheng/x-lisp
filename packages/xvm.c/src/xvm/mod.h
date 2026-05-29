#pragma once

#include <stdbool.h>

struct mod_t {
  record_t *definitions;
  set_t *test_names;
  char *entry_name;
};

mod_t *make_mod(void);
void mod_free(mod_t *self);

void mod_define(mod_t *self, const char *name, definition_t *definition);
definition_t *mod_lookup(mod_t *self, const char *name);
definition_t *mod_lookup_or_fail(mod_t *self, const char *name);

void mod_setup(mod_t *self);
void mod_call_entry(mod_t *self, const char *name);
void mod_test(mod_t *self, const char *snapshot, bool profile, bool builtin);
void mod_test_definition(mod_t *self, const char *snapshot, bool profile, definition_t *definition);
