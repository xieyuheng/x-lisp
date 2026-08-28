#pragma once

#include <stdbool.h>

struct program_t {
  record_t *definitions;
  set_t *test_names;
  char *entry_name;
};

program_t *make_program(void);
void program_free(program_t *self);

void program_define(program_t *self, const char *name, definition_t *definition);
definition_t *program_lookup(program_t *self, const char *name);
definition_t *program_lookup_or_fail(program_t *self, const char *name);

void program_setup(program_t *self);
void program_call_entry(program_t *self, const char *name);
void program_test(program_t *self, const char *snapshot, bool profile, bool builtin);
void program_test_definition(program_t *self, const char *snapshot, bool profile, definition_t *definition);
