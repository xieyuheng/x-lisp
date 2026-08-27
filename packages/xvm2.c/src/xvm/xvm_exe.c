#include "index.h"
#include "../builtin/index.h"

typedef struct {
  char    *name;
  uint8_t  kind;
  uint16_t arity;
  uint8_t  flags;
  uint16_t local_count;
  uint8_t *code;
  uint32_t code_length;
} definition_entry_t;

typedef struct {
  uint8_t kind;
  char   *data;
} value_entry_t;

typedef struct {
  uint32_t definition_index;
  uint32_t code_offset;
  char    *target_name;
} definition_relocation_t;

typedef struct {
  uint32_t definition_index;
  uint32_t code_offset;
  uint32_t value_index;
} value_relocation_t;

struct xvm_exe_t {
  array_t *definitions;
  array_t *values;
  array_t *definition_relocations;
  array_t *value_relocations;
  char *entry_name;
};

xvm_exe_t *make_xvm_exe(void) {
  xvm_exe_t *self = new(xvm_exe_t);
  self->definitions = make_array();
  self->values = make_array();
  self->definition_relocations = make_array();
  self->value_relocations = make_array();
  self->entry_name = NULL;
  return self;
}

void xvm_exe_free(xvm_exe_t *self) {
  for (size_t i = 0; i < array_length(self->definitions); i++) {
    definition_entry_t *entry = array_get(self->definitions, i);
    free(entry->name);
    free(entry->code);
    free(entry);
  }
  array_free(self->definitions);

  for (size_t i = 0; i < array_length(self->values); i++) {
    value_entry_t *entry = array_get(self->values, i);
    free(entry->data);
    free(entry);
  }
  array_free(self->values);

  for (size_t i = 0; i < array_length(self->definition_relocations); i++) {
    definition_relocation_t *reloc = array_get(self->definition_relocations, i);
    free(reloc->target_name);
    free(reloc);
  }
  array_free(self->definition_relocations);

  for (size_t i = 0; i < array_length(self->value_relocations); i++) {
    value_relocation_t *reloc = array_get(self->value_relocations, i);
    free(reloc);
  }
  array_free(self->value_relocations);

  free(self->entry_name);

  free(self);
}

// ── binary reading utilities ──

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

// ── raw parsing types for xvm_exe_load ──

typedef struct {
  uint8_t  kind;
  uint32_t name_offset;
  uint16_t arity;
  uint8_t  flags;
  uint16_t local_count;
  uint32_t code_length;
  uint8_t *code_ptr;
} raw_definition_t;

typedef struct {
  uint8_t  kind;
  uint32_t data_offset;
} raw_value_t;

typedef struct {
  uint32_t definition_index;
  uint32_t code_offset;
  uint32_t target_offset;
} raw_definition_relocation_t;

// ── helpers for xvm_exe_load ──

typedef struct {
  uint32_t magic;
  uint32_t version;
  uint32_t definition_count;
  uint32_t string_table_size;
  uint32_t value_count;
  uint32_t definition_relocation_count;
  uint32_t value_relocation_count;
  uint32_t entry_offset;
} file_header_t;

static void parse_and_validate_header(uint8_t *bytes, size_t *offset, file_header_t *header) {
  read_u32(bytes, offset, &header->magic);
  read_u32(bytes, offset, &header->version);
  read_u32(bytes, offset, &header->definition_count);
  read_u32(bytes, offset, &header->string_table_size);
  read_u32(bytes, offset, &header->value_count);
  read_u32(bytes, offset, &header->definition_relocation_count);
  read_u32(bytes, offset, &header->value_relocation_count);
  read_u32(bytes, offset, &header->entry_offset);

  if (header->magic != XVM_EXE_MAGIC) {
    who_printf("invalid xvm.exe magic: %08x\n", header->magic);
    exit(1);
  }
  if (header->version != XVM_EXE_VERSION) {
    who_printf("unsupported xvm.exe version: %d\n", header->version);
    exit(1);
  }
}

static raw_definition_t *parse_raw_definitions(uint8_t *bytes, size_t *offset,
                                               uint32_t count) {
  raw_definition_t *raw_defs = NULL;
  if (count > 0) {
    raw_defs = allocate(sizeof(raw_definition_t) * count);
  }

  for (uint32_t i = 0; i < count; i++) {
    read_byte(bytes, offset, &raw_defs[i].kind);
    read_u32(bytes, offset, &raw_defs[i].name_offset);
    read_u16(bytes, offset, &raw_defs[i].arity);
    read_byte(bytes, offset, &raw_defs[i].flags);

    if (raw_defs[i].kind == XVM_EXE_DEF_FUNCTION ||
        raw_defs[i].kind == XVM_EXE_DEF_VARIABLE) {
      read_u16(bytes, offset, &raw_defs[i].local_count);
      read_u32(bytes, offset, &raw_defs[i].code_length);
      raw_defs[i].code_ptr = bytes + *offset;
      *offset += raw_defs[i].code_length;
    } else {
      raw_defs[i].local_count = 0;
      raw_defs[i].code_length = 0;
      raw_defs[i].code_ptr = NULL;
    }
  }

  return raw_defs;
}

static raw_value_t *parse_raw_values(uint8_t *bytes, size_t *offset,
                                     uint32_t count) {
  raw_value_t *raw_vals = NULL;
  if (count > 0) {
    raw_vals = allocate(sizeof(raw_value_t) * count);
  }

  for (uint32_t i = 0; i < count; i++) {
    read_byte(bytes, offset, &raw_vals[i].kind);
    read_u32(bytes, offset, &raw_vals[i].data_offset);
  }

  return raw_vals;
}

static raw_definition_relocation_t *parse_raw_definition_relocations(uint8_t *bytes, size_t *offset,
                                                                     uint32_t count) {
  raw_definition_relocation_t *raw_relocs = NULL;
  if (count > 0) {
    raw_relocs = allocate(sizeof(raw_definition_relocation_t) * count);
  }

  for (uint32_t i = 0; i < count; i++) {
    read_u32(bytes, offset, &raw_relocs[i].definition_index);
    read_u32(bytes, offset, &raw_relocs[i].code_offset);
    read_u32(bytes, offset, &raw_relocs[i].target_offset);
  }

  return raw_relocs;
}

static void parse_value_relocations(xvm_exe_t *self, uint8_t *bytes, size_t *offset,
                                    uint32_t count) {
  for (uint32_t i = 0; i < count; i++) {
    value_relocation_t *reloc = new(value_relocation_t);

    read_u32(bytes, offset, &reloc->definition_index);
    read_u32(bytes, offset, &reloc->code_offset);
    read_u32(bytes, offset, &reloc->value_index);

    array_push(self->value_relocations, reloc);
  }
}

static void resolve_definitions(xvm_exe_t *self, raw_definition_t *raw_defs,
                                uint32_t count, uint8_t *string_table) {
  for (uint32_t i = 0; i < count; i++) {
    definition_entry_t *def_entry = new(definition_entry_t);

    def_entry->kind = raw_defs[i].kind;
    def_entry->name = string_copy((const char *)(string_table + raw_defs[i].name_offset));
    def_entry->arity = raw_defs[i].arity;
    def_entry->flags = raw_defs[i].flags;

    if (raw_defs[i].kind == XVM_EXE_DEF_FUNCTION ||
        raw_defs[i].kind == XVM_EXE_DEF_VARIABLE) {
      def_entry->local_count = raw_defs[i].local_count;
      def_entry->code_length = raw_defs[i].code_length;
      def_entry->code = allocate(raw_defs[i].code_length);
      memory_copy(def_entry->code, raw_defs[i].code_ptr, raw_defs[i].code_length);
    } else {
      def_entry->local_count = 0;
      def_entry->code_length = 0;
      def_entry->code = NULL;
    }

    array_push(self->definitions, def_entry);
  }
}

static void resolve_values(xvm_exe_t *self, raw_value_t *raw_vals,
                           uint32_t count, uint8_t *string_table) {
  for (uint32_t i = 0; i < count; i++) {
    value_entry_t *val_entry = new(value_entry_t);

    val_entry->kind = raw_vals[i].kind;
    val_entry->data = string_copy((const char *)(string_table + raw_vals[i].data_offset));

    array_push(self->values, val_entry);
  }
}

static void resolve_definition_relocations(xvm_exe_t *self,
                                           raw_definition_relocation_t *raw_relocs,
                                           uint32_t count, uint8_t *string_table) {
  for (uint32_t i = 0; i < count; i++) {
    definition_relocation_t *reloc = new(definition_relocation_t);

    reloc->definition_index = raw_relocs[i].definition_index;
    reloc->code_offset = raw_relocs[i].code_offset;
    reloc->target_name = string_copy((const char *)(string_table + raw_relocs[i].target_offset));

    array_push(self->definition_relocations, reloc);
  }
}

void xvm_exe_load(xvm_exe_t *self, const char *pathname) {
  file_t *file = open_file_or_fail(pathname, "r");
  uint8_t *bytes = file_read_bytes(file);
  file_close(file);

  size_t offset = 0;

  file_header_t header;
  parse_and_validate_header(bytes, &offset, &header);

  raw_definition_t *raw_defs = parse_raw_definitions(bytes, &offset, header.definition_count);
  raw_value_t *raw_vals = parse_raw_values(bytes, &offset, header.value_count);
  raw_definition_relocation_t *raw_def_relocs =
    parse_raw_definition_relocations(bytes, &offset, header.definition_relocation_count);
  parse_value_relocations(self, bytes, &offset, header.value_relocation_count);

  uint8_t *string_table = bytes + offset;

  if (header.entry_offset != 0) {
    self->entry_name = string_copy((const char *)(string_table + header.entry_offset));
  }

  resolve_definitions(self, raw_defs, header.definition_count, string_table);
  resolve_values(self, raw_vals, header.value_count, string_table);
  resolve_definition_relocations(self, raw_def_relocs, header.definition_relocation_count, string_table);

  free(raw_defs);
  free(raw_vals);
  free(raw_def_relocs);
  free(bytes);
}

// ── helpers for xvm_exe_to_mod ──

static value_t *build_value_table(xvm_exe_t *self, uint32_t *out_count) {
  uint32_t value_count = (uint32_t)array_length(self->values);
  value_t *value_objects = allocate(sizeof(value_t) * (value_count > 0 ? value_count : 1));
  record_t *xtext_pool = make_record();
  for (uint32_t i = 0; i < value_count; i++) {
    value_entry_t *entry = array_get(self->values, i);
    switch (entry->kind) {
    case XVM_EXE_VALUE_STRING: {
      xtext_t *xstr = record_get(xtext_pool, entry->data);
      if (!xstr) {
        xstr = make_static_xtext(entry->data);
        record_put(xtext_pool, entry->data, xstr);
      }
      value_objects[i] = x_object(xstr);
      break;
    }
    case XVM_EXE_VALUE_SYMBOL:
      value_objects[i] = x_object(intern_symbol(entry->data));
      break;
    default:
      who_printf("unknown value kind: %d\n", entry->kind);
      exit(1);
    }
  }
  record_free(xtext_pool);
  *out_count = value_count;
  return value_objects;
}

static definition_t **build_definitions_and_register(xvm_exe_t *self, mod_t *mod,
                                                     uint32_t *out_count) {
  uint32_t definition_count = (uint32_t)array_length(self->definitions);
  definition_t **definitions = allocate(sizeof(definition_t *) * (definition_count > 0 ? definition_count : 1));

  for (uint32_t i = 0; i < definition_count; i++) {
    definition_entry_t *def_entry = array_get(self->definitions, i);

    function_t *fn = make_function(string_copy(def_entry->name));
    fn->arity = def_entry->arity;
    fn->local_count = def_entry->local_count;
    if (def_entry->code_length > 0) {
      buffer_append_bytes(fn->buffer, def_entry->code, def_entry->code_length);
    }

    if (def_entry->kind == XVM_EXE_DEF_FUNCTION) {
      definitions[i] = make_function_definition(string_copy(def_entry->name), fn);
    } else {
      definitions[i] = make_variable_definition(string_copy(def_entry->name), x_void);
      definitions[i]->variable_definition.function = fn;
    }

    mod_define(mod, def_entry->name, definitions[i]);

    if (def_entry->flags & XVM_EXE_FLAG_IS_TEST) {
      set_add(mod->test_names, string_copy(def_entry->name));
    }
  }

  *out_count = definition_count;
  return definitions;
}

static void patch_definition_relocations(definition_t **definitions,
                                         xvm_exe_t *self, mod_t *mod) {
  for (uint32_t i = 0; i < array_length(self->definition_relocations); i++) {
    definition_relocation_t *reloc = array_get(self->definition_relocations, i);
    size_t def_index = reloc->definition_index;
    if (def_index >= array_length(self->definitions)) {
      who_printf("definition relocation definition_index out of range: %zu\n", def_index);
      exit(1);
    }

    function_t *fn = definition_function(definitions[def_index]);
    definition_t *target_def = mod_lookup_or_fail(mod, reloc->target_name);

    size_t code_offset = reloc->code_offset;
    if (code_offset + sizeof(definition_t *) > buffer_length(fn->buffer)) {
      who_printf("definition relocation offset out of range: %zu\n", code_offset);
      exit(1);
    }
    memory_store(buffer_raw_bytes(fn->buffer) + code_offset, target_def);
  }
}

static void patch_value_relocations(definition_t **definitions,
                                    value_t *value_objects,
                                    uint32_t value_count, xvm_exe_t *self) {
  for (uint32_t i = 0; i < array_length(self->value_relocations); i++) {
    value_relocation_t *reloc = array_get(self->value_relocations, i);
    size_t def_index = reloc->definition_index;
    if (def_index >= array_length(self->definitions)) {
      who_printf("value relocation definition_index out of range: %zu\n", def_index);
      exit(1);
    }

    function_t *fn = definition_function(definitions[def_index]);
    size_t value_index = reloc->value_index;
    if (value_index >= value_count) {
      who_printf("value relocation value_index out of range: %zu\n", value_index);
      exit(1);
    }

    size_t code_offset = reloc->code_offset;
    if (code_offset + sizeof(value_t) > buffer_length(fn->buffer)) {
      who_printf("value relocation offset out of range: %zu\n", code_offset);
      exit(1);
    }
    memory_store(buffer_raw_bytes(fn->buffer) + code_offset, value_objects[value_index]);
  }
}

mod_t *xvm_exe_to_mod(xvm_exe_t *self) {
  mod_t *mod = make_mod();
  import_builtin(mod);

  if (self->entry_name) {
    mod->entry_name = string_copy(self->entry_name);
  }

  uint32_t value_count;
  value_t *value_objects = build_value_table(self, &value_count);

  uint32_t definition_count;
  definition_t **definitions = build_definitions_and_register(self, mod, &definition_count);

  patch_definition_relocations(definitions, self, mod);
  patch_value_relocations(definitions, value_objects, value_count, self);

  mod_setup(mod);

  free(value_objects);
  free(definitions);

  return mod;
}