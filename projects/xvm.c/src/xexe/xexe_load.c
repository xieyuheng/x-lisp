#include "index.h"

typedef struct {
  uint8_t  kind;
  uint32_t name_offset;
  uint16_t arity;
  uint8_t  flags;
  uint16_t local_count;
  uint32_t code_length;
  uint8_t *code_ptr;
} parsed_definition_t;

typedef struct {
  uint32_t definition_index;
  uint32_t code_offset;
  uint32_t string_table_offset;
} parsed_definition_relocation_t;

typedef struct {
  uint32_t definition_index;
  uint32_t code_offset;
  uint32_t value_index;
} parsed_value_relocation_t;

typedef struct {
  uint8_t  kind;
  uint32_t data_offset;
} parsed_value_t;

typedef struct {
  uint32_t magic;
  uint32_t version;
  uint32_t definition_count;
  uint32_t string_table_size;
  uint32_t value_count;
  uint32_t definition_relocation_count;
  uint32_t value_relocation_count;
} xexe_header_t;

static inline void read_u32(uint8_t *bytes, size_t *offset, uint32_t *dst) {
  memory_load(bytes + *offset, *dst);
  *offset += 4;
}

static inline void read_u16(uint8_t *bytes, size_t *offset, uint16_t *dst) {
  memory_load(bytes + *offset, *dst);
  *offset += 2;
}

static inline void read_byte(uint8_t *bytes, size_t *offset, uint8_t *dst) {
  *dst = bytes[*offset];
  *offset += 1;
}

static xexe_header_t parse_header(uint8_t *bytes, size_t *offset) {
  xexe_header_t header;
  read_u32(bytes, offset, &header.magic);
  read_u32(bytes, offset, &header.version);
  read_u32(bytes, offset, &header.definition_count);
  read_u32(bytes, offset, &header.string_table_size);
  read_u32(bytes, offset, &header.value_count);
  read_u32(bytes, offset, &header.definition_relocation_count);
  read_u32(bytes, offset, &header.value_relocation_count);
  return header;
}

static void validate_header(xexe_header_t header) {
  if (header.magic != XEXE_MAGIC) {
    who_printf("invalid xexe magic: %08x\n", header.magic);
    exit(1);
  }
  if (header.version != XEXE_VERSION) {
    who_printf("unsupported xexe version: %d\n", header.version);
    exit(1);
  }
}

static parsed_definition_t *parse_definitions(uint8_t *bytes, size_t *offset, uint32_t definition_count) {
  if (definition_count == 0) return NULL;
  parsed_definition_t *definitions = allocate(sizeof(parsed_definition_t) * definition_count);
  for (uint32_t i = 0; i < definition_count; i++) {
    read_byte(bytes, offset, &definitions[i].kind);
    read_u32(bytes, offset, &definitions[i].name_offset);
    read_u16(bytes, offset, &definitions[i].arity);
    read_byte(bytes, offset, &definitions[i].flags);

    if (definitions[i].kind == XEXE_DEF_FUNCTION ||
        definitions[i].kind == XEXE_DEF_VARIABLE) {
      read_u16(bytes, offset, &definitions[i].local_count);
      read_u32(bytes, offset, &definitions[i].code_length);
      definitions[i].code_ptr = bytes + *offset;
      *offset += definitions[i].code_length;
    } else {
      definitions[i].local_count = 0;
      definitions[i].code_length = 0;
      definitions[i].code_ptr = NULL;
    }
  }
  return definitions;
}

static parsed_value_t *parse_values(uint8_t *bytes, size_t *offset, uint32_t value_count) {
  if (value_count == 0) return NULL;
  parsed_value_t *values = allocate(sizeof(parsed_value_t) * value_count);
  for (uint32_t i = 0; i < value_count; i++) {
    read_byte(bytes, offset, &values[i].kind);
    read_u32(bytes, offset, &values[i].data_offset);
  }
  return values;
}

static parsed_definition_relocation_t *parse_definition_relocations(uint8_t *bytes, size_t *offset, uint32_t count) {
  if (count == 0) return NULL;
  parsed_definition_relocation_t *relocations = allocate(sizeof(parsed_definition_relocation_t) * count);
  for (uint32_t i = 0; i < count; i++) {
    read_u32(bytes, offset, &relocations[i].definition_index);
    read_u32(bytes, offset, &relocations[i].code_offset);
    read_u32(bytes, offset, &relocations[i].string_table_offset);
  }
  return relocations;
}

static parsed_value_relocation_t *parse_value_relocations(uint8_t *bytes, size_t *offset, uint32_t count) {
  if (count == 0) return NULL;
  parsed_value_relocation_t *relocations = allocate(sizeof(parsed_value_relocation_t) * count);
  for (uint32_t i = 0; i < count; i++) {
    read_u32(bytes, offset, &relocations[i].definition_index);
    read_u32(bytes, offset, &relocations[i].code_offset);
    read_u32(bytes, offset, &relocations[i].value_index);
  }
  return relocations;
}

static value_t *reconstruct_values(parsed_value_t *parsed_values, uint32_t value_count,
                                    uint8_t *string_table) {
  if (value_count == 0) return NULL;
  value_t *objects = allocate(sizeof(value_t) * value_count);
  record_t *xstring_pool = make_record();
  for (uint32_t i = 0; i < value_count; i++) {
    const char *data = (const char *)(string_table + parsed_values[i].data_offset);
    switch (parsed_values[i].kind) {
    case XEXE_VALUE_KEYWORD:
      objects[i] = x_object(intern_keyword(data));
      break;
    case XEXE_VALUE_STRING: {
      xstring_t *xstring = record_get(xstring_pool, data);
      if (!xstring) {
        xstring = make_xstring(data);
        record_put(xstring_pool, (char *)data, xstring);
      }
      objects[i] = x_object(xstring);
      break;
    }
    case XEXE_VALUE_SYMBOL:
      objects[i] = x_object(intern_symbol(data));
      break;
    default:
      who_printf("unknown value kind: %d\n", parsed_values[i].kind);
      exit(1);
    }
  }
  record_free(xstring_pool);
  return objects;
}

static definition_t **create_definitions(mod_t *mod, parsed_definition_t *parsed_definitions,
                                         uint32_t definition_count, uint8_t *string_table) {
  if (definition_count == 0) return NULL;
  definition_t **definitions = allocate(sizeof(definition_t *) * definition_count);

  for (uint32_t i = 0; i < definition_count; i++) {
    const char *name = (const char *)(string_table + parsed_definitions[i].name_offset);

    function_t *fn = make_function(string_copy(name));
    fn->arity = parsed_definitions[i].arity;
    fn->local_count = parsed_definitions[i].local_count;
    if (parsed_definitions[i].code_length > 0) {
      buffer_append_bytes(fn->buffer, parsed_definitions[i].code_ptr, parsed_definitions[i].code_length);
    }

    if (parsed_definitions[i].kind == XEXE_DEF_FUNCTION) {
      definitions[i] = make_function_definition(string_copy(name), fn);
    } else {
      definitions[i] = make_variable_definition(string_copy(name), x_void);
      definitions[i]->variable_definition.function = fn;
    }

    mod_define(mod, name, definitions[i]);

    if (parsed_definitions[i].flags & XEXE_FLAG_IS_TEST) {
      set_add(mod->test_names, string_copy(name));
    }
  }

  return definitions;
}

static void patch_definition_relocations(definition_t **definitions, uint32_t definition_count,
                              parsed_definition_relocation_t *relocations, uint32_t relocation_count,
                              uint8_t *string_table, mod_t *mod) {
  for (uint32_t i = 0; i < relocation_count; i++) {
    size_t definition_index = relocations[i].definition_index;
    if (definition_index >= definition_count) {
      who_printf("definition relocation definition_index out of range: %zu >= %d\n", definition_index, definition_count);
      exit(1);
    }

    function_t *fn = definition_function(definitions[definition_index]);
    const char *target_name = (const char *)(string_table + relocations[i].string_table_offset);
    definition_t *target_def = mod_lookup_or_fail(mod, target_name);

    size_t offset = relocations[i].code_offset;
    if (offset + sizeof(definition_t *) > buffer_length(fn->buffer)) {
      who_printf("definition relocation offset out of range: %zu\n", offset);
      exit(1);
    }
    memory_store(buffer_raw_bytes(fn->buffer) + offset, target_def);
  }
}

static void patch_value_relocations(definition_t **definitions, uint32_t definition_count,
                                parsed_value_relocation_t *relocations, uint32_t relocation_count,
                                value_t *value_objects, uint32_t value_count) {
  for (uint32_t i = 0; i < relocation_count; i++) {
    size_t definition_index = relocations[i].definition_index;
    if (definition_index >= definition_count) {
      who_printf("value relocation definition_index out of range: %zu >= %d\n", definition_index, definition_count);
      exit(1);
    }

    function_t *fn = definition_function(definitions[definition_index]);
    size_t value_index = relocations[i].value_index;
    if (value_index >= value_count) {
      who_printf("value relocation value_index out of range: %zu >= %d\n", value_index, value_count);
      exit(1);
    }

    size_t offset = relocations[i].code_offset;
    if (offset + sizeof(value_t) > buffer_length(fn->buffer)) {
      who_printf("value relocation offset out of range: %zu\n", offset);
      exit(1);
    }
    memory_store(buffer_raw_bytes(fn->buffer) + offset, value_objects[value_index]);
  }
}

mod_t *xexe_load(path_t *path, bool profile) {
  double loading_start = time_millisecond();

  file_t *file = open_file_or_fail(path_raw_string(path), "r");
  uint8_t *bytes = file_read_bytes(file);
  file_close(file);

  size_t offset = 0;
  xexe_header_t header = parse_header(bytes, &offset);
  validate_header(header);

  parsed_definition_t *parsed_definitions = parse_definitions(bytes, &offset, header.definition_count);
  parsed_value_t *parsed_values = parse_values(bytes, &offset, header.value_count);
  parsed_definition_relocation_t *parsed_definition_relocations = parse_definition_relocations(bytes, &offset, header.definition_relocation_count);
  parsed_value_relocation_t *parsed_value_relocations = parse_value_relocations(bytes, &offset, header.value_relocation_count);

  uint8_t *string_table = bytes + offset;

  mod_t *mod = make_mod();
  import_builtin(mod);

  value_t *value_objects = reconstruct_values(parsed_values, header.value_count, string_table);
  definition_t **definitions = create_definitions(mod, parsed_definitions, header.definition_count, string_table);

  patch_definition_relocations(definitions, header.definition_count, parsed_definition_relocations, header.definition_relocation_count, string_table, mod);
  patch_value_relocations(definitions, header.definition_count, parsed_value_relocations, header.value_relocation_count,
                     value_objects, header.value_count);

  double loading_time = time_millisecond_passed(loading_start);
  if (profile) {
    who_printf("xexe loading time: %.3fms\n", loading_time);
  }

  xasm_setup(mod);

  free(parsed_definitions);
  free(parsed_values);
  free(parsed_definition_relocations);
  free(parsed_value_relocations);
  free(value_objects);
  free(definitions);
  free(bytes);

  return mod;
}
