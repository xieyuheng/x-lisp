#include "index.h"

typedef struct {
  definition_t *definition;
  uint8_t kind;
  uint32_t name_offset;
  uint16_t arity;
  uint8_t flags;
  uint16_t local_count;
  uint32_t code_length;
  uint8_t *code;
} definition_entry_t;

typedef struct {
  record_t *offsets;
  buffer_t *buffer;
} string_table_builder_t;

static string_table_builder_t *make_string_table_builder(void) {
  string_table_builder_t *string_table = new(string_table_builder_t);
  string_table->offsets = make_record();
  string_table->buffer = make_buffer();
  return string_table;
}

static uint32_t string_table_add(string_table_builder_t *string_table, const char *str) {
  if (record_has(string_table->offsets, str)) {
    return (uint32_t)(int64_t)record_get(string_table->offsets, str);
  }
  uint32_t offset = (uint32_t)buffer_length(string_table->buffer);
  record_put(string_table->offsets, (char *)str, (void *)(int64_t)offset);
  buffer_append_string(string_table->buffer, str);
  buffer_append_byte(string_table->buffer, '\0');
  return offset;
}

static void string_table_free(string_table_builder_t *string_table) {
  record_free(string_table->offsets);
  buffer_free(string_table->buffer);
  free(string_table);
}

static uint8_t compute_flags(mod_t *mod, const char *name) {
  return set_member(mod->test_names, (void *)name) ? XEXE_FLAG_IS_TEST : 0;
}

static bool should_serialize(definition_t *definition) {
  if (definition->kind == PRIMITIVE_DEFINITION) return false;
  if (definition->kind == FUNCTION_DEFINITION) return true;
  if (definition->kind == VARIABLE_DEFINITION) {
    return definition->variable_definition.function != NULL;
  }
  unreachable();
}

typedef struct {
  array_t *definitions;
  array_t *values;
  array_t *definition_relocations;
  array_t *value_relocations;
} reloc_ctx_t;

static void collect_relocs_for_function(string_table_builder_t *string_table,
                                         reloc_ctx_t *ctx,
                                         size_t definition_index,
                                         function_t *fn) {
  uint8_t *code = buffer_raw_bytes(fn->buffer);
  size_t length = buffer_length(fn->buffer);
  size_t pc = 0;

  while (pc < length) {
    uint8_t op = code[pc];

    if (op == OP_CALL || op == OP_TAIL_CALL) {
      definition_t *target;
      memory_load(code + pc + 1, target);
      const char *target_name = target->name;
      uint32_t target_offset = string_table_add(string_table, target_name);

      uint32_t *relocation = allocate(sizeof(uint32_t) * 3);
      relocation[0] = (uint32_t)definition_index;
      relocation[1] = (uint32_t)(pc + 1);
      relocation[2] = target_offset;
      array_push(ctx->definition_relocations, relocation);
    }

    if (op == OP_REF || op == OP_GLOBAL_LOAD || op == OP_GLOBAL_STORE) {
      definition_t *target;
      memory_load(code + pc + 1 + sizeof(uint16_t), target);
      const char *target_name = target->name;
      uint32_t target_offset = string_table_add(string_table, target_name);

      uint32_t *relocation = allocate(sizeof(uint32_t) * 3);
      relocation[0] = (uint32_t)definition_index;
      relocation[1] = (uint32_t)(pc + 1 + sizeof(uint16_t));
      relocation[2] = target_offset;
      array_push(ctx->definition_relocations, relocation);
    }

    if (op == OP_LOAD) {
      value_t value;
      memory_load(code + pc + 1 + sizeof(uint16_t), value);

      if (keyword_p(value)) {
        const char *data = keyword_string(to_keyword(value));
        uint32_t data_offset = string_table_add(string_table, data);

        uint8_t *value_entry = allocate(5);
        value_entry[0] = XEXE_VALUE_KEYWORD;
        memory_store(value_entry + 1, data_offset);
        array_push(ctx->values, value_entry);

        uint32_t *value_relocation = allocate(sizeof(uint32_t) * 3);
        value_relocation[0] = (uint32_t)definition_index;
        value_relocation[1] = (uint32_t)(pc + 1 + sizeof(uint16_t));
        value_relocation[2] = (uint32_t)array_length(ctx->values) - 1;
        array_push(ctx->value_relocations, value_relocation);
      } else if (xstring_p(value)) {
        const char *data = xstring_string(to_xstring(value));
        uint32_t data_offset = string_table_add(string_table, data);

        uint8_t *value_entry = allocate(5);
        value_entry[0] = XEXE_VALUE_STRING;
        memory_store(value_entry + 1, data_offset);
        array_push(ctx->values, value_entry);

        uint32_t *value_relocation = allocate(sizeof(uint32_t) * 3);
        value_relocation[0] = (uint32_t)definition_index;
        value_relocation[1] = (uint32_t)(pc + 1 + sizeof(uint16_t));
        value_relocation[2] = (uint32_t)array_length(ctx->values) - 1;
        array_push(ctx->value_relocations, value_relocation);
      } else if (symbol_p(value)) {
        const char *data = symbol_string(to_symbol(value));
        uint32_t data_offset = string_table_add(string_table, data);

        uint8_t *value_entry = allocate(5);
        value_entry[0] = XEXE_VALUE_SYMBOL;
        memory_store(value_entry + 1, data_offset);
        array_push(ctx->values, value_entry);

        uint32_t *value_relocation = allocate(sizeof(uint32_t) * 3);
        value_relocation[0] = (uint32_t)definition_index;
        value_relocation[1] = (uint32_t)(pc + 1 + sizeof(uint16_t));
        value_relocation[2] = (uint32_t)array_length(ctx->values) - 1;
        array_push(ctx->value_relocations, value_relocation);
      }
    }

    pc += instr_length(instr_decode_header(code + pc));
  }
}

void xexe_assemble(mod_t *mod, const char *output_pathname) {
  string_table_builder_t *string_table = make_string_table_builder();

  array_t *definitions = make_array();

  record_iter_t iter;
  record_iter_init(&iter, mod->definitions);
  const hash_entry_t *entry = record_iter_next_entry(&iter);
  while (entry) {
    definition_t *definition = entry->value;
    if (!should_serialize(definition)) {
      entry = record_iter_next_entry(&iter);
      continue;
    }

    definition_entry_t *definition_entry = new(definition_entry_t);
    definition_entry->definition = definition;

    if (definition->kind == FUNCTION_DEFINITION) {
      definition_entry->kind = XEXE_DEF_FUNCTION;
      function_t *fn = definition_function(definition);
      definition_entry->local_count = (uint16_t)fn->local_count;
      definition_entry->code_length = (uint32_t)buffer_length(fn->buffer);
      definition_entry->code = buffer_raw_bytes(fn->buffer);
    } else {
      definition_entry->kind = XEXE_DEF_VARIABLE;
      function_t *fn = definition->variable_definition.function;
      definition_entry->local_count = (uint16_t)fn->local_count;
      definition_entry->code_length = (uint32_t)buffer_length(fn->buffer);
      definition_entry->code = buffer_raw_bytes(fn->buffer);
    }

    definition_entry->name_offset = string_table_add(string_table, definition->name);
    if (definition->kind == FUNCTION_DEFINITION) {
      definition_entry->arity = (uint16_t)definition_arity(definition);
    } else {
      definition_entry->arity = 0;
    }
    definition_entry->flags = compute_flags(mod, definition->name);

    array_push(definitions, definition_entry);
    entry = record_iter_next_entry(&iter);
  }

  array_t *values_array = make_array();
  array_t *definition_relocations_array = make_array();
  array_t *value_relocations_array = make_array();

  reloc_ctx_t ctx = { definitions, values_array, definition_relocations_array, value_relocations_array };

  for (size_t i = 0; i < array_length(definitions); i++) {
    definition_entry_t *definition_entry = array_get(definitions, i);
    function_t *fn;
    if (definition_entry->definition->kind == FUNCTION_DEFINITION) {
      fn = definition_function(definition_entry->definition);
    } else {
      fn = definition_entry->definition->variable_definition.function;
    }
    collect_relocs_for_function(string_table, &ctx, i, fn);
  }

  size_t definition_count = array_length(definitions);
  size_t value_count = array_length(values_array);
  size_t definition_relocation_count = array_length(definition_relocations_array);
  size_t value_relocation_count = array_length(value_relocations_array);

  buffer_t *out = make_buffer();

  {
    uint8_t header[28];
    uint32_t magic_value = XEXE_MAGIC;
    uint32_t version_value = XEXE_VERSION;
    uint32_t definition_count_value = (uint32_t)definition_count;
    uint32_t string_table_size_value = (uint32_t)buffer_length(string_table->buffer);
    uint32_t value_count_value = (uint32_t)value_count;
    uint32_t definition_relocation_count_value = (uint32_t)definition_relocation_count;
    uint32_t value_relocation_count_value = (uint32_t)value_relocation_count;
    memory_store(header,      magic_value);
    memory_store(header + 4,  version_value);
    memory_store(header + 8,  definition_count_value);
    memory_store(header + 12, string_table_size_value);
    memory_store(header + 16, value_count_value);
    memory_store(header + 20, definition_relocation_count_value);
    memory_store(header + 24, value_relocation_count_value);
    buffer_append_bytes(out, header, 28);
  }

  for (size_t i = 0; i < definition_count; i++) {
    definition_entry_t *definition_entry = array_get(definitions, i);
    buffer_append_byte(out, definition_entry->kind);
    buffer_append_bytes(out, (uint8_t *)&definition_entry->name_offset, 4);
    buffer_append_bytes(out, (uint8_t *)&definition_entry->arity, 2);
    buffer_append_byte(out, definition_entry->flags);

    if (definition_entry->kind == XEXE_DEF_FUNCTION || definition_entry->kind == XEXE_DEF_VARIABLE) {
      buffer_append_bytes(out, (uint8_t *)&definition_entry->local_count, 2);
      buffer_append_bytes(out, (uint8_t *)&definition_entry->code_length, 4);
      buffer_append_bytes(out, definition_entry->code, definition_entry->code_length);
    }
  }

  for (size_t i = 0; i < value_count; i++) {
    uint8_t *value_entry = array_get(values_array, i);
    buffer_append_bytes(out, value_entry, 5);
  }

  for (size_t i = 0; i < definition_relocation_count; i++) {
    uint32_t *relocation = array_get(definition_relocations_array, i);
    buffer_append_bytes(out, (uint8_t *)relocation, 12);
  }

  for (size_t i = 0; i < value_relocation_count; i++) {
    uint32_t *relocation = array_get(value_relocations_array, i);
    buffer_append_bytes(out, (uint8_t *)relocation, 12);
  }

  buffer_append_bytes(out, buffer_raw_bytes(string_table->buffer), buffer_length(string_table->buffer));

  file_t *file = open_file_or_fail(output_pathname, "w");
  buffer_write(out, file);
  file_close(file);

  buffer_free(out);

  for (size_t i = 0; i < array_length(definition_relocations_array); i++)
    free(array_get(definition_relocations_array, i));
  array_free(definition_relocations_array);

  for (size_t i = 0; i < array_length(value_relocations_array); i++)
    free(array_get(value_relocations_array, i));
  array_free(value_relocations_array);

  for (size_t i = 0; i < array_length(values_array); i++)
    free(array_get(values_array, i));
  array_free(values_array);

  for (size_t i = 0; i < array_length(definitions); i++)
    free(array_get(definitions, i));
  array_free(definitions);

  string_table_free(string_table);
}
