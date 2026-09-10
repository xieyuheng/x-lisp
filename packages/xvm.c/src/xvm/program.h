#pragma once

struct primitive_entry_t {
  primitive_fn_t fn;
  uint8_t arity;
};

struct program_t {
  record_t *functions;
  record_t *primitives;
  record_t *variables;
};

program_t *make_program(void);
void program_free(program_t *self);

void program_define_function(program_t *self, const char *name, function_t *function);
function_t *program_lookup_function(program_t *self, const char *name);
function_t *program_lookup_function_or_fail(program_t *self, const char *name);

void program_define_primitive(program_t *self, const char *name, primitive_fn_t fn, uint8_t arity);
primitive_entry_t *program_lookup_primitive(program_t *self, const char *name);
primitive_entry_t *program_lookup_primitive_or_fail(program_t *self, const char *name);

value_t *program_define_variable(program_t *self, const char *name, value_t value);
value_t *program_lookup_variable(program_t *self, const char *name);
value_t *program_lookup_variable_or_fail(program_t *self, const char *name);

void program_call_entry(program_t *self, const char *name);
