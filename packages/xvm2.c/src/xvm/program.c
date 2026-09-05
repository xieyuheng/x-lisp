#include "index.h"
#include "../builtin/import_builtin.h"

static void primitive_entry_free(primitive_entry_t *self) {
  free(self);
}


program_t *make_program(void) {
  program_t *self = new(program_t);
  self->functions = make_record_with((free_fn_t *) function_free);
  self->primitives = make_record_with((free_fn_t *) primitive_entry_free);
  self->variables = make_record_with((free_fn_t *) free);
  self->threaded_codes_ready = false;
  import_builtin(self);
  return self;
}

void program_free(program_t *self) {
  if (self == NULL) return;
  record_free(self->functions);
  record_free(self->primitives);
  record_free(self->variables);
  free(self);
}

void program_define_function(program_t *self, const char *name, function_t *function) {
  if (record_has(self->functions, name)) {
    who_printf("can not redefine function: %s\n", name);
    exit(1);
  }
  record_insert(self->functions, name, function);
}

function_t *program_lookup_function(program_t *self, const char *name) {
  return record_get(self->functions, name);
}

function_t *program_lookup_function_or_fail(program_t *self, const char *name) {
  function_t *function = program_lookup_function(self, name);
  if (function == NULL) {
    who_printf("undefined function: %s\n", name);
    exit(1);
  }
  return function;
}

void program_define_primitive(program_t *self, const char *name, primitive_fn_t fn, uint8_t arity) {
  if (record_has(self->primitives, name)) {
    who_printf("can not redefine primitive: %s\n", name);
    exit(1);
  }
  primitive_entry_t *entry = new(primitive_entry_t);
  entry->fn = fn;
  entry->arity = arity;
  record_insert(self->primitives, name, entry);
}

primitive_entry_t *program_lookup_primitive(program_t *self, const char *name) {
  return record_get(self->primitives, name);
}

primitive_entry_t *program_lookup_primitive_or_fail(program_t *self, const char *name) {
  primitive_entry_t *entry = program_lookup_primitive(self, name);
  if (entry == NULL) {
    who_printf("undefined primitive: %s\n", name);
    exit(1);
  }
  return entry;
}

value_t *program_define_variable(program_t *self, const char *name, value_t value) {
  if (record_has(self->variables, name)) {
    who_printf("can not redefine variable: %s\n", name);
    exit(1);
  }
  value_t *slot = allocate(sizeof(value_t));
  *slot = value;
  record_insert(self->variables, name, slot);
  return slot;
}

value_t *program_lookup_variable(program_t *self, const char *name) {
  return record_get(self->variables, name);
}

value_t *program_lookup_variable_or_fail(program_t *self, const char *name) {
  value_t *slot = program_lookup_variable(self, name);
  if (slot == NULL) {
    who_printf("undefined variable: %s\n", name);
    exit(1);
  }
  return slot;
}

void program_call_entry(program_t *self, const char *name) {
  function_t *fn = program_lookup_function_or_fail(self, name);
  if (fn->arity != 0) {
    who_printf("entry function must be 0 arity\n");
    who_printf("  name: %s\n", name);
    who_printf("  arity: %d\n", fn->arity);
    exit(1);
  }

  xvm_t *xvm = make_xvm(self);
  xvm_push_function_frame_with_values(xvm, fn, 0, NULL);
  xvm->break_depth = xvm->frame_count - 1;
  xvm_execute(xvm);
  xvm_free(xvm);
}
