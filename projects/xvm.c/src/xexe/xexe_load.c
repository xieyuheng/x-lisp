#include "index.h"

typedef struct {
  uint8_t  kind;
  uint32_t name_off;
  uint16_t arity;
  uint8_t  flags;
  uint16_t local_count;
  uint32_t code_len;
  uint8_t *code_ptr;
} parsed_def_t;

typedef struct {
  uint32_t def_index;
  uint32_t offset;
  uint32_t target_off;
} parsed_def_reloc_t;

typedef struct {
  uint32_t def_index;
  uint32_t offset;
  uint32_t value_index;
} parsed_value_reloc_t;

typedef struct {
  uint8_t  kind;
  uint32_t data_off;
} parsed_value_t;

typedef struct {
  uint32_t magic;
  uint32_t version;
  uint32_t def_count;
  uint32_t strtab_size;
  uint32_t value_count;
  uint32_t def_reloc_count;
  uint32_t value_reloc_count;
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
  xexe_header_t hdr;
  read_u32(bytes, offset, &hdr.magic);
  read_u32(bytes, offset, &hdr.version);
  read_u32(bytes, offset, &hdr.def_count);
  read_u32(bytes, offset, &hdr.strtab_size);
  read_u32(bytes, offset, &hdr.value_count);
  read_u32(bytes, offset, &hdr.def_reloc_count);
  read_u32(bytes, offset, &hdr.value_reloc_count);
  return hdr;
}

static void validate_header(xexe_header_t hdr) {
  if (hdr.magic != XEXE_MAGIC) {
    who_printf("invalid xexe magic: %08x\n", hdr.magic);
    exit(1);
  }
  if (hdr.version != XEXE_VERSION) {
    who_printf("unsupported xexe version: %d\n", hdr.version);
    exit(1);
  }
}

static parsed_def_t *parse_definitions(uint8_t *bytes, size_t *offset, uint32_t def_count) {
  if (def_count == 0) return NULL;
  parsed_def_t *defs = allocate(sizeof(parsed_def_t) * def_count);
  for (uint32_t i = 0; i < def_count; i++) {
    read_byte(bytes, offset, &defs[i].kind);
    read_u32(bytes, offset, &defs[i].name_off);
    read_u16(bytes, offset, &defs[i].arity);
    read_byte(bytes, offset, &defs[i].flags);

    if (defs[i].kind == XEXE_DEF_FUNCTION ||
        defs[i].kind == XEXE_DEF_VARIABLE) {
      read_u16(bytes, offset, &defs[i].local_count);
      read_u32(bytes, offset, &defs[i].code_len);
      defs[i].code_ptr = bytes + *offset;
      *offset += defs[i].code_len;
    } else {
      defs[i].local_count = 0;
      defs[i].code_len = 0;
      defs[i].code_ptr = NULL;
    }
  }
  return defs;
}

static parsed_value_t *parse_values(uint8_t *bytes, size_t *offset, uint32_t value_count) {
  if (value_count == 0) return NULL;
  parsed_value_t *values = allocate(sizeof(parsed_value_t) * value_count);
  for (uint32_t i = 0; i < value_count; i++) {
    read_byte(bytes, offset, &values[i].kind);
    read_u32(bytes, offset, &values[i].data_off);
  }
  return values;
}

static parsed_def_reloc_t *parse_def_relocs(uint8_t *bytes, size_t *offset, uint32_t count) {
  if (count == 0) return NULL;
  parsed_def_reloc_t *relocs = allocate(sizeof(parsed_def_reloc_t) * count);
  for (uint32_t i = 0; i < count; i++) {
    read_u32(bytes, offset, &relocs[i].def_index);
    read_u32(bytes, offset, &relocs[i].offset);
    read_u32(bytes, offset, &relocs[i].target_off);
  }
  return relocs;
}

static parsed_value_reloc_t *parse_value_relocs(uint8_t *bytes, size_t *offset, uint32_t count) {
  if (count == 0) return NULL;
  parsed_value_reloc_t *relocs = allocate(sizeof(parsed_value_reloc_t) * count);
  for (uint32_t i = 0; i < count; i++) {
    read_u32(bytes, offset, &relocs[i].def_index);
    read_u32(bytes, offset, &relocs[i].offset);
    read_u32(bytes, offset, &relocs[i].value_index);
  }
  return relocs;
}

static value_t *reconstruct_values(parsed_value_t *parsed_values, uint32_t value_count,
                                    uint8_t *strtab) {
  if (value_count == 0) return NULL;
  value_t *objects = allocate(sizeof(value_t) * value_count);
  record_t *xstring_pool = make_record();
  for (uint32_t i = 0; i < value_count; i++) {
    const char *data = (const char *)(strtab + parsed_values[i].data_off);
    switch (parsed_values[i].kind) {
    case XEXE_VALUE_KEYWORD:
      objects[i] = x_object(intern_keyword(data));
      break;
    case XEXE_VALUE_STRING: {
      xstring_t *xs = record_get(xstring_pool, data);
      if (!xs) {
        xs = make_xstring(data);
        record_put(xstring_pool, (char *)data, xs);
      }
      objects[i] = x_object(xs);
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

static definition_t **create_definitions(mod_t *mod, parsed_def_t *parsed_defs,
                                         uint32_t def_count, uint8_t *strtab) {
  if (def_count == 0) return NULL;
  definition_t **defs = allocate(sizeof(definition_t *) * def_count);

  for (uint32_t i = 0; i < def_count; i++) {
    const char *name = (const char *)(strtab + parsed_defs[i].name_off);

    function_t *fn = make_function(string_copy(name));
    fn->arity = parsed_defs[i].arity;
    fn->local_count = parsed_defs[i].local_count;
    if (parsed_defs[i].code_len > 0) {
      buffer_append_bytes(fn->buffer, parsed_defs[i].code_ptr, parsed_defs[i].code_len);
    }

    if (parsed_defs[i].kind == XEXE_DEF_FUNCTION) {
      defs[i] = make_function_definition(mod, string_copy(name), fn);
    } else {
      defs[i] = make_variable_definition(mod, string_copy(name), x_void);
      defs[i]->variable_definition.function = fn;
    }

    mod_define(mod, name, defs[i]);

    if (parsed_defs[i].flags & XEXE_FLAG_IS_TEST) {
      set_add(mod->test_names, string_copy(name));
    }
  }

  return defs;
}

static void patch_def_relocs(definition_t **defs, uint32_t def_count,
                              parsed_def_reloc_t *relocs, uint32_t reloc_count,
                              uint8_t *strtab, mod_t *mod) {
  for (uint32_t i = 0; i < reloc_count; i++) {
    size_t di = relocs[i].def_index;
    if (di >= def_count) {
      who_printf("def reloc def_index out of range: %zu >= %d\n", di, def_count);
      exit(1);
    }

    function_t *fn = definition_function(defs[di]);
    const char *target_name = (const char *)(strtab + relocs[i].target_off);
    definition_t *target_def = mod_lookup_or_fail(mod, target_name);

    size_t offset = relocs[i].offset;
    if (offset + sizeof(definition_t *) > buffer_length(fn->buffer)) {
      who_printf("def reloc offset out of range: %zu\n", offset);
      exit(1);
    }
    memory_store(buffer_raw_bytes(fn->buffer) + offset, target_def);
  }
}

static void patch_value_relocs(definition_t **defs, uint32_t def_count,
                                parsed_value_reloc_t *relocs, uint32_t reloc_count,
                                value_t *value_objects, uint32_t value_count) {
  for (uint32_t i = 0; i < reloc_count; i++) {
    size_t di = relocs[i].def_index;
    if (di >= def_count) {
      who_printf("value reloc def_index out of range: %zu >= %d\n", di, def_count);
      exit(1);
    }

    function_t *fn = definition_function(defs[di]);
    size_t vi = relocs[i].value_index;
    if (vi >= value_count) {
      who_printf("value reloc value_index out of range: %zu >= %d\n", vi, value_count);
      exit(1);
    }

    size_t offset = relocs[i].offset;
    if (offset + sizeof(value_t) > buffer_length(fn->buffer)) {
      who_printf("value reloc offset out of range: %zu\n", offset);
      exit(1);
    }
    memory_store(buffer_raw_bytes(fn->buffer) + offset, value_objects[vi]);
  }
}

mod_t *xexe_load(path_t *path, bool profile) {
  double loading_start = time_millisecond();

  file_t *file = open_file_or_fail(path_raw_string(path), "r");
  uint8_t *bytes = file_read_bytes(file);
  file_close(file);

  size_t offset = 0;
  xexe_header_t hdr = parse_header(bytes, &offset);
  validate_header(hdr);

  parsed_def_t *parsed_defs = parse_definitions(bytes, &offset, hdr.def_count);
  parsed_value_t *parsed_values = parse_values(bytes, &offset, hdr.value_count);
  parsed_def_reloc_t *parsed_def_relocs = parse_def_relocs(bytes, &offset, hdr.def_reloc_count);
  parsed_value_reloc_t *parsed_value_relocs = parse_value_relocs(bytes, &offset, hdr.value_reloc_count);

  uint8_t *strtab = bytes + offset;

  mod_t *mod = make_mod();
  import_builtin(mod);

  value_t *value_objects = reconstruct_values(parsed_values, hdr.value_count, strtab);
  definition_t **defs = create_definitions(mod, parsed_defs, hdr.def_count, strtab);

  patch_def_relocs(defs, hdr.def_count, parsed_def_relocs, hdr.def_reloc_count, strtab, mod);
  patch_value_relocs(defs, hdr.def_count, parsed_value_relocs, hdr.value_reloc_count,
                     value_objects, hdr.value_count);

  double loading_time = time_millisecond_passed(loading_start);
  if (profile) {
    who_printf("xexe loading time: %.3fms\n", loading_time);
  }

  xasm_setup(mod);

  free(parsed_defs);
  free(parsed_values);
  free(parsed_def_relocs);
  free(parsed_value_relocs);
  free(value_objects);
  free(defs);
  free(bytes);

  return mod;
}
