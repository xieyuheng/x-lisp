#include "index.h"

typedef struct {
  definition_t *definition;
  uint8_t kind;
  uint32_t name_off;
  uint16_t arity;
  uint8_t flags;
  uint16_t local_count;
  uint32_t code_len;
  uint8_t *code;
} def_entry_t;

typedef struct {
  record_t *offsets;
  buffer_t *buffer;
} strtab_builder_t;

static strtab_builder_t *make_strtab_builder(void) {
  strtab_builder_t *st = new(strtab_builder_t);
  st->offsets = make_record();
  st->buffer = make_buffer();
  return st;
}

static uint32_t strtab_add(strtab_builder_t *st, const char *str) {
  if (record_has(st->offsets, str)) {
    return (uint32_t)(int64_t)record_get(st->offsets, str);
  }
  uint32_t offset = (uint32_t)buffer_length(st->buffer);
  record_put(st->offsets, (char *)str, (void *)(int64_t)offset);
  buffer_append_string(st->buffer, str);
  buffer_append_byte(st->buffer, '\0');
  return offset;
}

static void strtab_free(strtab_builder_t *st) {
  record_free(st->offsets);
  buffer_free(st->buffer);
  free(st);
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
  array_t *defs;
  array_t *values;
  array_t *def_relocs;
  array_t *value_relocs;
} reloc_ctx_t;

static void collect_relocs_for_function(strtab_builder_t *st,
                                         reloc_ctx_t *ctx,
                                         size_t def_index,
                                         function_t *fn) {
  uint8_t *code = buffer_raw_bytes(fn->buffer);
  size_t len = buffer_length(fn->buffer);
  size_t pc = 0;

  while (pc < len) {
    uint8_t op = code[pc];

    if (op == OP_CALL || op == OP_TAIL_CALL) {
      definition_t *target;
      memory_load(code + pc + 1, target);
      const char *target_name = target->name;
      uint32_t target_off = strtab_add(st, target_name);

      uint32_t *reloc = allocate(sizeof(uint32_t) * 3);
      reloc[0] = (uint32_t)def_index;
      reloc[1] = (uint32_t)(pc + 1);
      reloc[2] = target_off;
      array_push(ctx->def_relocs, reloc);
    }

    if (op == OP_REF || op == OP_GLOBAL_LOAD || op == OP_GLOBAL_STORE) {
      definition_t *target;
      memory_load(code + pc + 1 + sizeof(uint16_t), target);
      const char *target_name = target->name;
      uint32_t target_off = strtab_add(st, target_name);

      uint32_t *reloc = allocate(sizeof(uint32_t) * 3);
      reloc[0] = (uint32_t)def_index;
      reloc[1] = (uint32_t)(pc + 1 + sizeof(uint16_t));
      reloc[2] = target_off;
      array_push(ctx->def_relocs, reloc);
    }

    if (op == OP_LOAD) {
      value_t value;
      memory_load(code + pc + 1 + sizeof(uint16_t), value);

      if (keyword_p(value)) {
        const char *data = keyword_string(to_keyword(value));
        uint32_t data_off = strtab_add(st, data);

        uint8_t *ve = allocate(5);
        ve[0] = XEXE_VALUE_KEYWORD;
        memory_store(ve + 1, data_off);
        array_push(ctx->values, ve);

        uint32_t *vreloc = allocate(sizeof(uint32_t) * 3);
        vreloc[0] = (uint32_t)def_index;
        vreloc[1] = (uint32_t)(pc + 1 + sizeof(uint16_t));
        vreloc[2] = (uint32_t)array_length(ctx->values) - 1;
        array_push(ctx->value_relocs, vreloc);
      } else if (xstring_p(value)) {
        const char *data = xstring_string(to_xstring(value));
        uint32_t data_off = strtab_add(st, data);

        uint8_t *ve = allocate(5);
        ve[0] = XEXE_VALUE_STRING;
        memory_store(ve + 1, data_off);
        array_push(ctx->values, ve);

        uint32_t *vreloc = allocate(sizeof(uint32_t) * 3);
        vreloc[0] = (uint32_t)def_index;
        vreloc[1] = (uint32_t)(pc + 1 + sizeof(uint16_t));
        vreloc[2] = (uint32_t)array_length(ctx->values) - 1;
        array_push(ctx->value_relocs, vreloc);
      } else if (symbol_p(value)) {
        const char *data = symbol_string(to_symbol(value));
        uint32_t data_off = strtab_add(st, data);

        uint8_t *ve = allocate(5);
        ve[0] = XEXE_VALUE_SYMBOL;
        memory_store(ve + 1, data_off);
        array_push(ctx->values, ve);

        uint32_t *vreloc = allocate(sizeof(uint32_t) * 3);
        vreloc[0] = (uint32_t)def_index;
        vreloc[1] = (uint32_t)(pc + 1 + sizeof(uint16_t));
        vreloc[2] = (uint32_t)array_length(ctx->values) - 1;
        array_push(ctx->value_relocs, vreloc);
      }
    }

    pc += instr_length(instr_decode_header(code + pc));
  }
}

void xexe_assemble(mod_t *mod, const char *output_pathname) {
  strtab_builder_t *st = make_strtab_builder();

  array_t *defs = make_array();

  record_iter_t iter;
  record_iter_init(&iter, mod->definitions);
  const hash_entry_t *entry = record_iter_next_entry(&iter);
  while (entry) {
    definition_t *definition = entry->value;
    if (!should_serialize(definition)) {
      entry = record_iter_next_entry(&iter);
      continue;
    }

    def_entry_t *de = new(def_entry_t);
    de->definition = definition;

    if (definition->kind == FUNCTION_DEFINITION) {
      de->kind = XEXE_DEF_FUNCTION;
      function_t *fn = definition_function(definition);
      de->local_count = (uint16_t)fn->local_count;
      de->code_len = (uint32_t)buffer_length(fn->buffer);
      de->code = buffer_raw_bytes(fn->buffer);
    } else {
      de->kind = XEXE_DEF_VARIABLE;
      function_t *fn = definition->variable_definition.function;
      de->local_count = (uint16_t)fn->local_count;
      de->code_len = (uint32_t)buffer_length(fn->buffer);
      de->code = buffer_raw_bytes(fn->buffer);
    }

    de->name_off = strtab_add(st, definition->name);
    if (definition->kind == FUNCTION_DEFINITION) {
      de->arity = (uint16_t)definition_arity(definition);
    } else {
      de->arity = 0;
    }
    de->flags = compute_flags(mod, definition->name);

    array_push(defs, de);
    entry = record_iter_next_entry(&iter);
  }

  array_t *values_array = make_array();
  array_t *def_relocs_array = make_array();
  array_t *value_relocs_array = make_array();

  reloc_ctx_t ctx = { defs, values_array, def_relocs_array, value_relocs_array };

  for (size_t i = 0; i < array_length(defs); i++) {
    def_entry_t *de = array_get(defs, i);
    function_t *fn;
    if (de->definition->kind == FUNCTION_DEFINITION) {
      fn = definition_function(de->definition);
    } else {
      fn = de->definition->variable_definition.function;
    }
    collect_relocs_for_function(st, &ctx, i, fn);
  }

  size_t def_count = array_length(defs);
  size_t value_count = array_length(values_array);
  size_t def_reloc_count = array_length(def_relocs_array);
  size_t value_reloc_count = array_length(value_relocs_array);

  buffer_t *out = make_buffer();

  {
    uint8_t header[28];
    uint32_t magic_v = XEXE_MAGIC;
    uint32_t version_v = XEXE_VERSION;
    uint32_t def_count_v = (uint32_t)def_count;
    uint32_t strtab_size_v = (uint32_t)buffer_length(st->buffer);
    uint32_t value_count_v = (uint32_t)value_count;
    uint32_t def_reloc_count_v = (uint32_t)def_reloc_count;
    uint32_t value_reloc_count_v = (uint32_t)value_reloc_count;
    memory_store(header,      magic_v);
    memory_store(header + 4,  version_v);
    memory_store(header + 8,  def_count_v);
    memory_store(header + 12, strtab_size_v);
    memory_store(header + 16, value_count_v);
    memory_store(header + 20, def_reloc_count_v);
    memory_store(header + 24, value_reloc_count_v);
    buffer_append_bytes(out, header, 28);
  }

  for (size_t i = 0; i < def_count; i++) {
    def_entry_t *de = array_get(defs, i);
    buffer_append_byte(out, de->kind);
    buffer_append_bytes(out, (uint8_t *)&de->name_off, 4);
    buffer_append_bytes(out, (uint8_t *)&de->arity, 2);
    buffer_append_byte(out, de->flags);

    if (de->kind == XEXE_DEF_FUNCTION || de->kind == XEXE_DEF_VARIABLE) {
      buffer_append_bytes(out, (uint8_t *)&de->local_count, 2);
      buffer_append_bytes(out, (uint8_t *)&de->code_len, 4);
      buffer_append_bytes(out, de->code, de->code_len);
    }
  }

  for (size_t i = 0; i < value_count; i++) {
    uint8_t *ve = array_get(values_array, i);
    buffer_append_bytes(out, ve, 5);
  }

  for (size_t i = 0; i < def_reloc_count; i++) {
    uint32_t *reloc = array_get(def_relocs_array, i);
    buffer_append_bytes(out, (uint8_t *)reloc, 12);
  }

  for (size_t i = 0; i < value_reloc_count; i++) {
    uint32_t *reloc = array_get(value_relocs_array, i);
    buffer_append_bytes(out, (uint8_t *)reloc, 12);
  }

  buffer_append_bytes(out, buffer_raw_bytes(st->buffer), buffer_length(st->buffer));

  file_t *file = open_file_or_fail(output_pathname, "w");
  buffer_write(out, file);
  file_close(file);

  buffer_free(out);

  for (size_t i = 0; i < array_length(def_relocs_array); i++)
    free(array_get(def_relocs_array, i));
  array_free(def_relocs_array);

  for (size_t i = 0; i < array_length(value_relocs_array); i++)
    free(array_get(value_relocs_array, i));
  array_free(value_relocs_array);

  for (size_t i = 0; i < array_length(values_array); i++)
    free(array_get(values_array, i));
  array_free(values_array);

  for (size_t i = 0; i < array_length(defs); i++)
    free(array_get(defs, i));
  array_free(defs);

  strtab_free(st);
}
