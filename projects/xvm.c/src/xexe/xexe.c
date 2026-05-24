#include "index.h"

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

struct xexe_t {
  array_t *definitions;
  array_t *values;
  array_t *definition_relocations;
  array_t *value_relocations;
  char *entry_name;
};

xexe_t *make_xexe(void) {
  xexe_t *self = new(xexe_t);
  self->definitions = make_array();
  self->values = make_array();
  self->definition_relocations = make_array();
  self->value_relocations = make_array();
  self->entry_name = NULL;
  return self;
}

void xexe_free(xexe_t *self) {
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

// ── helpers for xexe_from_mod ──

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

static void collect_definitions_from_mod(xexe_t *self, mod_t *mod) {
  record_iter_t iter;
  record_iter_init(&iter, mod->definitions);
  const hash_entry_t *entry = record_iter_next_entry(&iter);
  while (entry) {
    definition_t *definition = entry->value;
    if (!should_serialize(definition)) {
      entry = record_iter_next_entry(&iter);
      continue;
    }

    definition_entry_t *def_entry = new(definition_entry_t);
    def_entry->name = string_copy(definition->name);
    def_entry->flags = compute_flags(mod, definition->name);

    function_t *fn;
    if (definition->kind == FUNCTION_DEFINITION) {
      def_entry->kind = XEXE_DEF_FUNCTION;
      fn = definition_function(definition);
      def_entry->arity = (uint16_t)definition_arity(definition);
    } else {
      def_entry->kind = XEXE_DEF_VARIABLE;
      fn = definition->variable_definition.function;
      def_entry->arity = 0;
    }

    def_entry->local_count = (uint16_t)fn->local_count;
    def_entry->code_length = (uint32_t)buffer_length(fn->buffer);
    def_entry->code = allocate(def_entry->code_length);
    memory_copy(def_entry->code, buffer_raw_bytes(fn->buffer), def_entry->code_length);

    array_push(self->definitions, def_entry);

    entry = record_iter_next_entry(&iter);
  }
}

static void scan_bytecode_for_relocations(xexe_t *self, size_t definition_index,
                                          uint8_t *code, size_t length) {
  size_t pc = 0;

  while (pc < length) {
    uint8_t op = code[pc];

    if (op == OP_CALL || op == OP_TAIL_CALL) {
      definition_t *target;
      memory_load(code + pc + 1, target);

      definition_relocation_t *reloc = new(definition_relocation_t);
      reloc->definition_index = (uint32_t)definition_index;
      reloc->code_offset = (uint32_t)(pc + 1);
      reloc->target_name = string_copy(target->name);
      array_push(self->definition_relocations, reloc);
    }

    if (op == OP_REF || op == OP_GLOBAL_LOAD || op == OP_GLOBAL_STORE) {
      definition_t *target;
      memory_load(code + pc + 1 + sizeof(uint16_t), target);

      definition_relocation_t *reloc = new(definition_relocation_t);
      reloc->definition_index = (uint32_t)definition_index;
      reloc->code_offset = (uint32_t)(pc + 1 + sizeof(uint16_t));
      reloc->target_name = string_copy(target->name);
      array_push(self->definition_relocations, reloc);
    }

    if (op == OP_LOAD) {
      value_t value;
      memory_load(code + pc + 1 + sizeof(uint16_t), value);

      value_entry_t *entry = NULL;

      if (keyword_p(value)) {
        entry = new(value_entry_t);
        entry->kind = XEXE_VALUE_KEYWORD;
        entry->data = string_copy(keyword_string(to_keyword(value)));
      } else if (xstring_p(value)) {
        entry = new(value_entry_t);
        entry->kind = XEXE_VALUE_STRING;
        entry->data = string_copy(xstring_string(to_xstring(value)));
      } else if (symbol_p(value)) {
        entry = new(value_entry_t);
        entry->kind = XEXE_VALUE_SYMBOL;
        entry->data = string_copy(symbol_string(to_symbol(value)));
      }

      if (entry) {
        uint32_t value_index = (uint32_t)array_length(self->values);
        array_push(self->values, entry);

        value_relocation_t *reloc = new(value_relocation_t);
        reloc->definition_index = (uint32_t)definition_index;
        reloc->code_offset = (uint32_t)(pc + 1 + sizeof(uint16_t));
        reloc->value_index = value_index;
        array_push(self->value_relocations, reloc);
      }
    }

    pc += instr_length(instr_decode_header(code + pc));
  }
}

static void collect_relocations_from_bytecode(xexe_t *self) {
  for (size_t i = 0; i < array_length(self->definitions); i++) {
    definition_entry_t *def_entry = array_get(self->definitions, i);
    scan_bytecode_for_relocations(self, i, def_entry->code, def_entry->code_length);
  }
}

void xexe_from_mod(xexe_t *self, mod_t *mod) {
  collect_definitions_from_mod(self, mod);
  collect_relocations_from_bytecode(self);
  if (mod->entry_name) {
    self->entry_name = string_copy(mod->entry_name);
  }
}

// ── string table builder ──

typedef struct {
  record_t *offsets;
  buffer_t *buffer;
} string_table_builder_t;

static string_table_builder_t *string_table_builder_create(void) {
  string_table_builder_t *st = new(string_table_builder_t);
  st->offsets = make_record();
  st->buffer = make_buffer();
  // prepend a null byte so that offset 0 can be used as a sentinel for "no entry"
  buffer_append_byte(st->buffer, '\0');
  return st;
}

static uint32_t string_table_builder_add(string_table_builder_t *st, const char *str) {
  if (record_has(st->offsets, str)) {
    return (uint32_t)(int64_t)record_get(st->offsets, str);
  }
  uint32_t offset = (uint32_t)buffer_length(st->buffer);
  record_put(st->offsets, (char *)str, (void *)(int64_t)offset);
  buffer_append_string(st->buffer, str);
  buffer_append_byte(st->buffer, '\0');
  return offset;
}

static void string_table_builder_free(string_table_builder_t *st) {
  record_free(st->offsets);
  buffer_free(st->buffer);
  free(st);
}

// ── helpers for xexe_dump ──

static void collect_strings(string_table_builder_t *st, xexe_t *self) {
  for (size_t i = 0; i < array_length(self->definitions); i++) {
    definition_entry_t *def_entry = array_get(self->definitions, i);
    string_table_builder_add(st, def_entry->name);
  }
  for (size_t i = 0; i < array_length(self->values); i++) {
    value_entry_t *val_entry = array_get(self->values, i);
    string_table_builder_add(st, val_entry->data);
  }
  for (size_t i = 0; i < array_length(self->definition_relocations); i++) {
    definition_relocation_t *reloc = array_get(self->definition_relocations, i);
    string_table_builder_add(st, reloc->target_name);
  }
  if (self->entry_name) {
    string_table_builder_add(st, self->entry_name);
  }
}

static void write_header(buffer_t *out, uint32_t definition_count, uint32_t value_count,
                         uint32_t definition_relocation_count,
                         uint32_t value_relocation_count,
                         uint32_t string_table_size,
                         uint32_t entry_offset) {
  uint8_t header[32];
  uint32_t header_magic = XEXE_MAGIC;
  uint32_t header_version = XEXE_VERSION;
  memory_store(header,      header_magic);
  memory_store(header + 4,  header_version);
  memory_store(header + 8,  definition_count);
  memory_store(header + 12, string_table_size);
  memory_store(header + 16, value_count);
  memory_store(header + 20, definition_relocation_count);
  memory_store(header + 24, value_relocation_count);
  memory_store(header + 28, entry_offset);
  buffer_append_bytes(out, header, 32);
}

static void write_definitions_section(buffer_t *out, xexe_t *self,
                                      string_table_builder_t *st) {
  for (size_t i = 0; i < array_length(self->definitions); i++) {
    definition_entry_t *def_entry = array_get(self->definitions, i);
    uint32_t name_offset = string_table_builder_add(st, def_entry->name);

    buffer_append_byte(out, def_entry->kind);
    buffer_append_bytes(out, (uint8_t *)&name_offset, 4);
    buffer_append_bytes(out, (uint8_t *)&def_entry->arity, 2);
    buffer_append_byte(out, def_entry->flags);

    if (def_entry->kind == XEXE_DEF_FUNCTION || def_entry->kind == XEXE_DEF_VARIABLE) {
      buffer_append_bytes(out, (uint8_t *)&def_entry->local_count, 2);
      buffer_append_bytes(out, (uint8_t *)&def_entry->code_length, 4);
      buffer_append_bytes(out, def_entry->code, def_entry->code_length);
    }
  }
}

static void write_values_section(buffer_t *out, xexe_t *self,
                                 string_table_builder_t *st) {
  for (size_t i = 0; i < array_length(self->values); i++) {
    value_entry_t *val_entry = array_get(self->values, i);
    uint32_t data_offset = string_table_builder_add(st, val_entry->data);

    buffer_append_byte(out, val_entry->kind);
    buffer_append_bytes(out, (uint8_t *)&data_offset, 4);
  }
}

static void write_definition_relocations_section(buffer_t *out, xexe_t *self,
                                                 string_table_builder_t *st) {
  for (size_t i = 0; i < array_length(self->definition_relocations); i++) {
    definition_relocation_t *reloc = array_get(self->definition_relocations, i);
    uint32_t target_offset = string_table_builder_add(st, reloc->target_name);

    buffer_append_bytes(out, (uint8_t *)&reloc->definition_index, 4);
    buffer_append_bytes(out, (uint8_t *)&reloc->code_offset, 4);
    buffer_append_bytes(out, (uint8_t *)&target_offset, 4);
  }
}

static void write_value_relocations_section(buffer_t *out, xexe_t *self) {
  for (size_t i = 0; i < array_length(self->value_relocations); i++) {
    value_relocation_t *reloc = array_get(self->value_relocations, i);

    buffer_append_bytes(out, (uint8_t *)&reloc->definition_index, 4);
    buffer_append_bytes(out, (uint8_t *)&reloc->code_offset, 4);
    buffer_append_bytes(out, (uint8_t *)&reloc->value_index, 4);
  }
}

void xexe_dump(xexe_t *self, const char *pathname) {
  string_table_builder_t *st = string_table_builder_create();
  collect_strings(st, self);

  uint32_t definition_count = (uint32_t)array_length(self->definitions);
  uint32_t value_count = (uint32_t)array_length(self->values);
  uint32_t definition_relocation_count = (uint32_t)array_length(self->definition_relocations);
  uint32_t value_relocation_count = (uint32_t)array_length(self->value_relocations);
  uint32_t string_table_size = (uint32_t)buffer_length(st->buffer);
  uint32_t entry_offset = self->entry_name
    ? string_table_builder_add(st, self->entry_name)
    : 0;

  buffer_t *out = make_buffer();

  write_header(out, definition_count, value_count,
               definition_relocation_count, value_relocation_count,
               string_table_size, entry_offset);
  write_definitions_section(out, self, st);
  write_values_section(out, self, st);
  write_definition_relocations_section(out, self, st);
  write_value_relocations_section(out, self);
  buffer_append_bytes(out, buffer_raw_bytes(st->buffer), buffer_length(st->buffer));

  file_t *file = open_file_or_fail(pathname, "w");
  buffer_write(out, file);
  file_close(file);

  buffer_free(out);
  string_table_builder_free(st);
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

// ── raw parsing types for xexe_load ──

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

// ── helpers for xexe_load ──

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

  if (header->magic != XEXE_MAGIC) {
    who_printf("invalid xexe magic: %08x\n", header->magic);
    exit(1);
  }
  if (header->version != XEXE_VERSION) {
    who_printf("unsupported xexe version: %d\n", header->version);
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

    if (raw_defs[i].kind == XEXE_DEF_FUNCTION ||
        raw_defs[i].kind == XEXE_DEF_VARIABLE) {
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

static void parse_value_relocations(xexe_t *self, uint8_t *bytes, size_t *offset,
                                    uint32_t count) {
  for (uint32_t i = 0; i < count; i++) {
    value_relocation_t *reloc = new(value_relocation_t);

    read_u32(bytes, offset, &reloc->definition_index);
    read_u32(bytes, offset, &reloc->code_offset);
    read_u32(bytes, offset, &reloc->value_index);

    array_push(self->value_relocations, reloc);
  }
}

static void resolve_definitions(xexe_t *self, raw_definition_t *raw_defs,
                                uint32_t count, uint8_t *string_table) {
  for (uint32_t i = 0; i < count; i++) {
    definition_entry_t *def_entry = new(definition_entry_t);

    def_entry->kind = raw_defs[i].kind;
    def_entry->name = string_copy((const char *)(string_table + raw_defs[i].name_offset));
    def_entry->arity = raw_defs[i].arity;
    def_entry->flags = raw_defs[i].flags;

    if (raw_defs[i].kind == XEXE_DEF_FUNCTION ||
        raw_defs[i].kind == XEXE_DEF_VARIABLE) {
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

static void resolve_values(xexe_t *self, raw_value_t *raw_vals,
                           uint32_t count, uint8_t *string_table) {
  for (uint32_t i = 0; i < count; i++) {
    value_entry_t *val_entry = new(value_entry_t);

    val_entry->kind = raw_vals[i].kind;
    val_entry->data = string_copy((const char *)(string_table + raw_vals[i].data_offset));

    array_push(self->values, val_entry);
  }
}

static void resolve_definition_relocations(xexe_t *self,
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

void xexe_load(xexe_t *self, const char *pathname) {
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

// ── helpers for xexe_to_mod ──

static value_t *build_value_table(xexe_t *self, uint32_t *out_count) {
  uint32_t value_count = (uint32_t)array_length(self->values);
  value_t *value_objects = allocate(sizeof(value_t) * (value_count > 0 ? value_count : 1));
  record_t *xstring_pool = make_record();
  for (uint32_t i = 0; i < value_count; i++) {
    value_entry_t *entry = array_get(self->values, i);
    switch (entry->kind) {
    case XEXE_VALUE_KEYWORD:
      value_objects[i] = x_object(intern_keyword(entry->data));
      break;
    case XEXE_VALUE_STRING: {
      xstring_t *xstr = record_get(xstring_pool, entry->data);
      if (!xstr) {
        xstr = make_xstring(entry->data);
        record_put(xstring_pool, entry->data, xstr);
      }
      value_objects[i] = x_object(xstr);
      break;
    }
    case XEXE_VALUE_SYMBOL:
      value_objects[i] = x_object(intern_symbol(entry->data));
      break;
    default:
      who_printf("unknown value kind: %d\n", entry->kind);
      exit(1);
    }
  }
  record_free(xstring_pool);
  *out_count = value_count;
  return value_objects;
}

static definition_t **build_definitions_and_register(xexe_t *self, mod_t *mod,
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

    if (def_entry->kind == XEXE_DEF_FUNCTION) {
      definitions[i] = make_function_definition(string_copy(def_entry->name), fn);
    } else {
      definitions[i] = make_variable_definition(string_copy(def_entry->name), x_void);
      definitions[i]->variable_definition.function = fn;
    }

    mod_define(mod, def_entry->name, definitions[i]);

    if (def_entry->flags & XEXE_FLAG_IS_TEST) {
      set_add(mod->test_names, string_copy(def_entry->name));
    }
  }

  *out_count = definition_count;
  return definitions;
}

static void patch_definition_relocations(definition_t **definitions,
                                         xexe_t *self, mod_t *mod) {
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
                                    uint32_t value_count, xexe_t *self) {
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

mod_t *xexe_to_mod(xexe_t *self) {
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
