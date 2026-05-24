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
};

xexe_t *make_xexe(void) {
  xexe_t *self = new(xexe_t);
  self->definitions = make_array();
  self->values = make_array();
  self->definition_relocations = make_array();
  self->value_relocations = make_array();
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

  free(self);
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

static void collect_relocs(xexe_t *self, size_t definition_index,
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

void xexe_from_mod(xexe_t *self, mod_t *mod) {
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

  for (size_t i = 0; i < array_length(self->definitions); i++) {
    definition_entry_t *def_entry = array_get(self->definitions, i);
    collect_relocs(self, i, def_entry->code, def_entry->code_length);
  }
}

typedef struct {
  record_t *offsets;
  buffer_t *buffer;
} string_table_builder_t;

static string_table_builder_t *string_table_builder_create(void) {
  string_table_builder_t *st = new(string_table_builder_t);
  st->offsets = make_record();
  st->buffer = make_buffer();
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

void xexe_dump(xexe_t *self, const char *pathname) {
  string_table_builder_t *st = string_table_builder_create();

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

  uint32_t definition_count = (uint32_t)array_length(self->definitions);
  uint32_t value_count = (uint32_t)array_length(self->values);
  uint32_t definition_relocation_count = (uint32_t)array_length(self->definition_relocations);
  uint32_t value_relocation_count = (uint32_t)array_length(self->value_relocations);
  uint32_t string_table_size = (uint32_t)buffer_length(st->buffer);

  buffer_t *out = make_buffer();

  {
    uint8_t header[28];
    uint32_t header_magic = XEXE_MAGIC;
    uint32_t header_version = XEXE_VERSION;
    memory_store(header,      header_magic);
    memory_store(header + 4,  header_version);
    memory_store(header + 8,  definition_count);
    memory_store(header + 12, string_table_size);
    memory_store(header + 16, value_count);
    memory_store(header + 20, definition_relocation_count);
    memory_store(header + 24, value_relocation_count);
    buffer_append_bytes(out, header, 28);
  }

  for (size_t i = 0; i < definition_count; i++) {
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

  for (size_t i = 0; i < value_count; i++) {
    value_entry_t *val_entry = array_get(self->values, i);
    uint32_t data_offset = string_table_builder_add(st, val_entry->data);

    buffer_append_byte(out, val_entry->kind);
    buffer_append_bytes(out, (uint8_t *)&data_offset, 4);
  }

  for (size_t i = 0; i < definition_relocation_count; i++) {
    definition_relocation_t *reloc = array_get(self->definition_relocations, i);
    uint32_t target_offset = string_table_builder_add(st, reloc->target_name);

    buffer_append_bytes(out, (uint8_t *)&reloc->definition_index, 4);
    buffer_append_bytes(out, (uint8_t *)&reloc->code_offset, 4);
    buffer_append_bytes(out, (uint8_t *)&target_offset, 4);
  }

  for (size_t i = 0; i < value_relocation_count; i++) {
    value_relocation_t *reloc = array_get(self->value_relocations, i);

    buffer_append_bytes(out, (uint8_t *)&reloc->definition_index, 4);
    buffer_append_bytes(out, (uint8_t *)&reloc->code_offset, 4);
    buffer_append_bytes(out, (uint8_t *)&reloc->value_index, 4);
  }

  buffer_append_bytes(out, buffer_raw_bytes(st->buffer), buffer_length(st->buffer));

  file_t *file = open_file_or_fail(pathname, "w");
  buffer_write(out, file);
  file_close(file);

  buffer_free(out);
  string_table_builder_free(st);
}

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

void xexe_load(xexe_t *self, const char *pathname) {
  file_t *file = open_file_or_fail(pathname, "r");
  uint8_t *bytes = file_read_bytes(file);
  file_close(file);

  size_t offset = 0;

  uint32_t magic, version, definition_count, string_table_size,
           value_count, definition_relocation_count, value_relocation_count;
  read_u32(bytes, &offset, &magic);
  read_u32(bytes, &offset, &version);
  read_u32(bytes, &offset, &definition_count);
  read_u32(bytes, &offset, &string_table_size);
  read_u32(bytes, &offset, &value_count);
  read_u32(bytes, &offset, &definition_relocation_count);
  read_u32(bytes, &offset, &value_relocation_count);

  if (magic != XEXE_MAGIC) {
    who_printf("invalid xexe magic: %08x\n", magic);
    exit(1);
  }
  if (version != XEXE_VERSION) {
    who_printf("unsupported xexe version: %d\n", version);
    exit(1);
  }

  typedef struct {
    uint8_t  kind;
    uint32_t name_offset;
    uint16_t arity;
    uint8_t  flags;
    uint16_t local_count;
    uint32_t code_length;
    uint8_t *code_ptr;
  } raw_def_t;

  raw_def_t *raw_defs = NULL;
  if (definition_count > 0) {
    raw_defs = allocate(sizeof(raw_def_t) * definition_count);
  }

  for (uint32_t i = 0; i < definition_count; i++) {
    read_byte(bytes, &offset, &raw_defs[i].kind);
    read_u32(bytes, &offset, &raw_defs[i].name_offset);
    read_u16(bytes, &offset, &raw_defs[i].arity);
    read_byte(bytes, &offset, &raw_defs[i].flags);

    if (raw_defs[i].kind == XEXE_DEF_FUNCTION ||
        raw_defs[i].kind == XEXE_DEF_VARIABLE) {
      read_u16(bytes, &offset, &raw_defs[i].local_count);
      read_u32(bytes, &offset, &raw_defs[i].code_length);
      raw_defs[i].code_ptr = bytes + offset;
      offset += raw_defs[i].code_length;
    } else {
      raw_defs[i].local_count = 0;
      raw_defs[i].code_length = 0;
      raw_defs[i].code_ptr = NULL;
    }
  }

  typedef struct {
    uint8_t  kind;
    uint32_t data_offset;
  } raw_val_t;

  raw_val_t *raw_vals = NULL;
  if (value_count > 0) {
    raw_vals = allocate(sizeof(raw_val_t) * value_count);
  }

  for (uint32_t i = 0; i < value_count; i++) {
    read_byte(bytes, &offset, &raw_vals[i].kind);
    read_u32(bytes, &offset, &raw_vals[i].data_offset);
  }

  typedef struct {
    uint32_t definition_index;
    uint32_t code_offset;
    uint32_t target_offset;
  } raw_def_reloc_t;

  raw_def_reloc_t *raw_def_relocs = NULL;
  if (definition_relocation_count > 0) {
    raw_def_relocs = allocate(sizeof(raw_def_reloc_t) * definition_relocation_count);
  }

  for (uint32_t i = 0; i < definition_relocation_count; i++) {
    read_u32(bytes, &offset, &raw_def_relocs[i].definition_index);
    read_u32(bytes, &offset, &raw_def_relocs[i].code_offset);
    read_u32(bytes, &offset, &raw_def_relocs[i].target_offset);
  }

  for (uint32_t i = 0; i < value_relocation_count; i++) {
    value_relocation_t *reloc = new(value_relocation_t);

    read_u32(bytes, &offset, &reloc->definition_index);
    read_u32(bytes, &offset, &reloc->code_offset);
    read_u32(bytes, &offset, &reloc->value_index);

    array_push(self->value_relocations, reloc);
  }

  uint8_t *string_table = bytes + offset;

  for (uint32_t i = 0; i < definition_count; i++) {
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

  for (uint32_t i = 0; i < value_count; i++) {
    value_entry_t *val_entry = new(value_entry_t);

    val_entry->kind = raw_vals[i].kind;
    val_entry->data = string_copy((const char *)(string_table + raw_vals[i].data_offset));

    array_push(self->values, val_entry);
  }

  for (uint32_t i = 0; i < definition_relocation_count; i++) {
    definition_relocation_t *reloc = new(definition_relocation_t);

    reloc->definition_index = raw_def_relocs[i].definition_index;
    reloc->code_offset = raw_def_relocs[i].code_offset;
    reloc->target_name = string_copy((const char *)(string_table + raw_def_relocs[i].target_offset));

    array_push(self->definition_relocations, reloc);
  }

  free(raw_defs);
  free(raw_vals);
  free(raw_def_relocs);
  free(bytes);
}

mod_t *xexe_to_mod(xexe_t *self) {
  mod_t *mod = make_mod();
  import_builtin(mod);

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

  for (uint32_t i = 0; i < array_length(self->definition_relocations); i++) {
    definition_relocation_t *reloc = array_get(self->definition_relocations, i);
    size_t def_index = reloc->definition_index;
    if (def_index >= definition_count) {
      who_printf("definition relocation definition_index out of range: %zu >= %d\n", def_index, definition_count);
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

  for (uint32_t i = 0; i < array_length(self->value_relocations); i++) {
    value_relocation_t *reloc = array_get(self->value_relocations, i);
    size_t def_index = reloc->definition_index;
    if (def_index >= definition_count) {
      who_printf("value relocation definition_index out of range: %zu >= %d\n", def_index, definition_count);
      exit(1);
    }

    function_t *fn = definition_function(definitions[def_index]);
    size_t value_index = reloc->value_index;
    if (value_index >= value_count) {
      who_printf("value relocation value_index out of range: %zu >= %d\n", value_index, value_count);
      exit(1);
    }

    size_t code_offset = reloc->code_offset;
    if (code_offset + sizeof(value_t) > buffer_length(fn->buffer)) {
      who_printf("value relocation offset out of range: %zu\n", code_offset);
      exit(1);
    }
    memory_store(buffer_raw_bytes(fn->buffer) + code_offset, value_objects[value_index]);
  }

  mod_setup(mod);

  free(value_objects);
  free(definitions);

  return mod;
}
