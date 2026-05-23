#pragma once

struct function_t {
  const char *name;
  size_t local_count;
  record_t *label_offsets;
  record_t *label_references;
  size_t arity;
  buffer_t *buffer;
};

function_t *make_function(const char *name);
void function_free(function_t *self);

void function_append_instr(function_t *self, struct instr_t instr);
void function_put_instr(function_t *self, size_t code_index, struct instr_t instr);
void function_add_label(function_t *self, const char *name);
bool function_has_label(const function_t *self, const char *name);
int32_t function_get_label_offset(const function_t *self, const char *name);
char *function_get_label_name_from_offset(const function_t *self, int32_t offset);

void function_add_label_reference(function_t *self, const char *name, int32_t offset);
list_t *function_get_label_reference_list(const function_t *self, const char *name);
void function_patch_label_references(function_t *self);
