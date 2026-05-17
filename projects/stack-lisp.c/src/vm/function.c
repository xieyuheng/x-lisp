#include "index.h"

function_t *make_function(const char *name) {
  function_t *self = new(function_t);
  self->name = name;
  self->label_offsets = make_record();
  self->label_references = make_record_with((free_fn_t *) list_free);
  self->arity = 0;
  self->buffer = make_buffer();
  return self;
}

void function_free(function_t *self) {
  record_free(self->label_offsets);
  record_free(self->label_references);
  buffer_free(self->buffer);
  free(self);
}

void function_append_instr(function_t *self, struct instr_t instr) {
  size_t length = instr_length(instr);
  uint8_t encoded[length];
  instr_encode(encoded, instr);
  buffer_append_bytes(self->buffer, encoded, length);
}

void function_put_instr(function_t *self, size_t code_index, struct instr_t instr) {
  size_t length = instr_length(instr);
  buffer_ensure_capacity(self->buffer, code_index + length);
  uint8_t *code = buffer_raw_bytes(self->buffer) + code_index;
  instr_encode(code, instr);
}

void function_put_definition(
  function_t *self,
  size_t code_index,
  definition_t *definition
) {
  buffer_ensure_capacity(self->buffer, code_index + sizeof(definition_t *));
  uint8_t *code = buffer_raw_bytes(self->buffer) + code_index;
  memory_store(code, definition);
}

void function_add_label(function_t *self, const char *name) {
  if (!function_has_label(self, name)) {
    record_insert(self->label_offsets, name, (void *)(int64_t)buffer_length(self->buffer));
  }
}

bool function_has_label(const function_t *self, const char *name) {
  return record_has(self->label_offsets, name);
}

int32_t function_get_label_offset(const function_t *self, const char *name) {
  assert(function_has_label(self, name));
  return (int64_t) record_get(self->label_offsets, name);
}

char *function_get_label_name_from_offset(const function_t *self, int32_t offset) {
  record_iter_t iter;
  record_iter_init(&iter, self->label_offsets);
  const hash_entry_t *entry = record_iter_next_entry(&iter);
  while (entry) {
    char *name = entry->key;
    if ((int32_t) (int64_t) entry->value == offset) {
      return name;
    }

    entry = record_iter_next_entry(&iter);
  }

  return NULL;
}

void function_add_label_reference(function_t *self, const char *name, int32_t offset) {
  if (!record_has(self->label_references, name)) {
    record_insert(self->label_references, name, make_list());
  }

  list_t *reference_list = record_get(self->label_references, name);
  list_push(reference_list, (void *) (int64_t) offset);
}

list_t *function_get_label_reference_list(const function_t *self, const char *name) {
  return record_get(self->label_references, name);
}

void function_patch_label_references(function_t *self) {
  record_iter_t iter;
  record_iter_init(&iter, self->label_references);
  const hash_entry_t *entry = record_iter_next_entry(&iter);
  while (entry) {
    char *name = entry->key;
    int32_t label_offset = function_get_label_offset(self, name);
    list_t *reference_list = entry->value;
    for (size_t i = 0; i < list_length(reference_list); i++) {
      int32_t code_offset = (int32_t) (int64_t) list_get(reference_list, i);
      int32_t offset = label_offset - (code_offset + sizeof(int32_t));
      buffer_put_bytes(self->buffer, code_offset, (const uint8_t *)&offset, sizeof(int32_t));
    }

    entry = record_iter_next_entry(&iter);
  }
}
