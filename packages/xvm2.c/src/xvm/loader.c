#include "index.h"

typedef struct {
  uint8_t tag;
  uint32_t length;
  const uint8_t *value;
} tlv_entry_t;

typedef struct {
  tlv_entry_t *entries;
  size_t count;
  const uint8_t *bytes;
} tlv_t;

typedef struct {
  const uint8_t *bytes;
  size_t byte_length;
} name_table_t;

static uint16_t read_u16le(const uint8_t *p) {
  return (uint16_t)p[0] | ((uint16_t)p[1] << 8);
}

static uint32_t read_u32le(const uint8_t *p) {
  return (uint32_t)p[0]
    | ((uint32_t)p[1] << 8)
    | ((uint32_t)p[2] << 16)
    | ((uint32_t)p[3] << 24);
}

static tlv_t parse_tlv(const uint8_t *bytes, size_t size) {
  tlv_t tlv;
  tlv.bytes = bytes;
  tlv.entries = NULL;
  tlv.count = 0;

  size_t capacity = 0;
  size_t offset = 0;
  while (offset < size) {
    if (size - offset < 5) {
      who_printf("truncated TLV header\n");
      exit(1);
    }

    if (tlv.count == capacity) {
      capacity = capacity == 0 ? 8 : capacity * 2;
      tlv.entries = realloc(tlv.entries, capacity * sizeof(tlv_entry_t));
    }

    tlv_entry_t *entry = &tlv.entries[tlv.count];
    entry->tag = bytes[offset];
    entry->length = read_u32le(bytes + offset + 1);
    offset += 5;

    if (size - offset < entry->length) {
      who_printf("truncated TLV value\n");
      exit(1);
    }

    entry->value = bytes + offset;
    offset += entry->length;
    tlv.count += 1;
  }

  return tlv;
}

static const char *name_at(const name_table_t *table, uint32_t offset) {
  if (offset >= table->byte_length) {
    who_printf("name offset out of range\n");
    exit(1);
  }
  return (const char *) table->bytes + offset;
}

static name_table_t find_name_table(const tlv_t *tlv) {
  for (size_t i = 0; i < tlv->count; i++) {
    if (tlv->entries[i].tag == 0x01) {
      name_table_t table = { tlv->entries[i].value, tlv->entries[i].length };
      return table;
    }
  }

  who_printf("missing name table\n");
  exit(1);
}

static const tlv_entry_t *find_entries(
  const tlv_t *tlv,
  uint8_t tag,
  size_t *count
) {
  *count = 0;
  for (size_t i = 0; i < tlv->count; i++) {
    if (tlv->entries[i].tag == tag) *count += 1;
  }
  if (*count == 0) return NULL;

  tlv_entry_t *entries = allocate((*count) * sizeof(tlv_entry_t));
  size_t j = 0;
  for (size_t i = 0; i < tlv->count; i++) {
    if (tlv->entries[i].tag == tag) {
      entries[j++] = tlv->entries[i];
    }
  }
  return entries;
}

static function_t *load_function(const name_table_t *names, const tlv_entry_t *entry) {
  const uint8_t *p = entry->value;
  uint32_t name_offset = read_u32le(p);
  uint16_t arity = read_u16le(p + 4);
  uint16_t local_count = read_u16le(p + 6);
  uint32_t code_length = read_u32le(p + 8);

  function_t *function = make_function(name_at(names, name_offset), arity, local_count);
  function->code_length = code_length;
  function->bytecode = allocate(code_length);
  memory_copy(function->bytecode, p + 12, code_length);

  return function;
}

static void apply_fixups(program_t *program, const name_table_t *names, const tlv_entry_t *fixup_table) {
  const uint8_t *p = fixup_table->value;
  size_t offset = 0;

  while (offset < fixup_table->length) {
    const char *type = name_at(names, read_u32le(p + offset));
    const char *name = name_at(names, read_u32le(p + offset + 4));
    const char *dest_name = name_at(names, read_u32le(p + offset + 8));
    uint32_t dest_offset = read_u32le(p + offset + 12);

    function_t *dest_function = program_lookup_function_or_fail(program, dest_name);
    uint8_t *dest = dest_function->bytecode + dest_offset;

    if (string_equal(type, "string-value")) {
      value_t value = x_object(make_static_xtext(name));
      memory_copy(dest, &value, sizeof(value_t));
    } else if (string_equal(type, "symbol-value")) {
      value_t value = x_object(intern_symbol(name));
      memory_copy(dest, &value, sizeof(value_t));
    } else if (string_equal(type, "fn-pointer")) {
      function_t *target = program_lookup_function_or_fail(program, name);
      memory_copy(dest, &target, sizeof(function_t *));
    } else if (string_equal(type, "prim-pointer")) {
      primitive_entry_t *target = program_lookup_primitive_or_fail(program, name);
      primitive_fn_t fn = target->fn;
      memory_copy(dest, &fn, sizeof(primitive_fn_t));
    } else if (string_equal(type, "global-pointer")) {
      value_t *target = program_lookup_variable_or_fail(program, name);
      memory_copy(dest, &target, sizeof(value_t *));
    } else {
      who_printf("unknown fixup type: %s\n", type);
      exit(1);
    }

    offset += 16;
  }
}

program_t *program_load(const char *pathname) {
  file_t *file = open_file_or_fail(pathname, "rb");
  size_t size = (size_t) file_size(file);
  uint8_t *bytes = file_read_bytes(file);
  file_close(file);

  tlv_t tlv = parse_tlv(bytes, size);
  name_table_t names = find_name_table(&tlv);

  program_t *program = make_program();

  // variable declarations
  size_t variable_count = 0;
  const tlv_entry_t *variable_entries = find_entries(&tlv, 0x11, &variable_count);
  for (size_t i = 0; i < variable_count; i++) {
    const char *name = name_at(&names, read_u32le(variable_entries[i].value));
    program_define_variable(program, name, x_void);
  }
  free((void *) variable_entries);

  // primitive variable declarations
  size_t primitive_variable_count = 0;
  const tlv_entry_t *primitive_variable_entries = find_entries(&tlv, 0x13, &primitive_variable_count);
  for (size_t i = 0; i < primitive_variable_count; i++) {
    const char *name = name_at(&names, read_u32le(primitive_variable_entries[i].value));
    (void) program_lookup_variable(program, name);
  }
  free((void *) primitive_variable_entries);

  // primitive function declarations
  size_t primitive_count = 0;
  const tlv_entry_t *primitive_entries = find_entries(&tlv, 0x12, &primitive_count);
  for (size_t i = 0; i < primitive_count; i++) {
    const char *name = name_at(&names, read_u32le(primitive_entries[i].value));
    (void) program_lookup_primitive(program, name);
  }
  free((void *) primitive_entries);

  // function definitions
  size_t function_count = 0;
  const tlv_entry_t *function_entries = find_entries(&tlv, 0x10, &function_count);
  for (size_t i = 0; i < function_count; i++) {
    function_t *function = load_function(&names, &function_entries[i]);
    program_define_function(program, function->name, function);
  }
  free((void *) function_entries);

  // fixups
  size_t fixup_count = 0;
  const tlv_entry_t *fixup_entries = find_entries(&tlv, 0x14, &fixup_count);
  if (fixup_count > 0) {
    apply_fixups(program, &names, &fixup_entries[0]);
  }
  free((void *) fixup_entries);

  program_build_threaded_codes(program);

  free(tlv.entries);
  free(bytes);
  return program;
}
