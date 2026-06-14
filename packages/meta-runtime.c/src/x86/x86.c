#include "index.h"

typedef void *(fn_t)(void);

#define PAGE_SIZE 4096
#define PAGE_ALIGN(s) ((((size_t)(s)) + PAGE_SIZE - 1) & ~(PAGE_SIZE - 1))

struct x86_image_t {
  void *base;
  size_t code_region;
  size_t image_size;
  size_t data_size;
  uint32_t entry_offset;
  xvm_t *xvm;
  array_t *native_names;
};

static uint32_t read_u32_le(const uint8_t *p) {
  return (uint32_t) p[0]
    | ((uint32_t) p[1] << 8)
    | ((uint32_t) p[2] << 16)
    | ((uint32_t) p[3] << 24);
}

void *x86_execute_flat(const buffer_t *buffer) {
  uint8_t *bytes = buffer_raw_bytes(buffer);
  size_t length = buffer_length(buffer);

  void *memory = mmap(
    NULL, length,
    PROT_READ | PROT_WRITE | PROT_EXEC,
    MAP_PRIVATE | MAP_ANONYMOUS,
    -1, 0);

  if (memory == MAP_FAILED) {
    where_printf("[mmap]: %s\n", strerror(errno));
    exit(1);
  }

  memcpy(memory, bytes, length);

  fn_t *fn;
  memcpy(&fn, &memory, sizeof(fn));
  void *result = fn();
  munmap(memory, length);
  return result;
}

void *x86_execute_exe(const buffer_t *buffer) {
  return x86_execute_exe_with_xvm(NULL, buffer);
}

void *x86_execute_exe_with_xvm(xvm_t *xvm, const buffer_t *buffer) {
  x86_image_t *image = x86_load_image(xvm, buffer);
  if (!image) return NULL;
  void *result = x86_call_entry(image);
  x86_unload_image(image);
  return result;
}

x86_image_t *x86_load_image(xvm_t *xvm, const buffer_t *buffer) {
  const uint8_t *bytes = buffer_raw_bytes(buffer);
  size_t file_length = buffer_length(buffer);

  if (file_length < 64) {
    where_printf("[x86_execute_exe] file too small: %zu bytes (need >= 64)\n", file_length);
    exit(1);
  }

  if (bytes[0] != 'X' || bytes[1] != '8' || bytes[2] != '6' || bytes[3] != 0x00) {
    where_printf("[x86_execute_exe] bad magic: %02x %02x %02x %02x\n",
                 bytes[0], bytes[1], bytes[2], bytes[3]);
    exit(1);
  }

  uint32_t flags = read_u32_le(bytes + 0x04);
  uint32_t code_size = read_u32_le(bytes + 0x08);
  uint32_t data_size = read_u32_le(bytes + 0x0c);
  uint32_t space_size = read_u32_le(bytes + 0x10);
  uint32_t internal_reloc_count = read_u32_le(bytes + 0x14);
  uint32_t external_reloc_count = read_u32_le(bytes + 0x18);
  uint32_t entry_offset = read_u32_le(bytes + 0x1c);
  uint32_t value_reloc_count = read_u32_le(bytes + 0x20);

  if (flags != 0) {
    where_printf("[x86_execute_exe] unsupported flags: 0x%08x\n", flags);
    exit(1);
  }

  for (size_t i = 4; i < 32; i++) {
    if (bytes[0x20 + i] != 0) {
      where_printf("[x86_execute_exe] unsupported version (non-zero reserved)\n");
      exit(1);
    }
  }

  size_t code_region = PAGE_ALIGN(code_size);
  size_t image_size = code_region + (size_t) data_size + (size_t) space_size;

  void *base = mmap(
    NULL, image_size,
    PROT_READ | PROT_WRITE,
    MAP_PRIVATE | MAP_ANONYMOUS,
    -1, 0);

  if (base == MAP_FAILED) {
    where_printf("[mmap]: %s\n", strerror(errno));
    exit(1);
  }

  memcpy(base, bytes + 64, code_size);
  memcpy((uint8_t *) base + code_region, bytes + 64 + code_size, data_size);

  for (uint32_t i = 0; i < internal_reloc_count; i++) {
    uint32_t offset = read_u32_le(bytes + 64 + code_size + data_size + i * 8);
    uint32_t target = read_u32_le(bytes + 64 + code_size + data_size + i * 8 + 4);
    *(uint64_t *) ((uint8_t *) base + offset) = (uint64_t) ((uint8_t *) base + target);
  }

  array_t *native_names = make_array();

  if (external_reloc_count > 0) {
    x86_symtab_init();
    union { value_t (*fn)(value_t, uint8_t, value_t *); void *ptr; } na;
    na.fn = native_apply;
    x86_symtab_register("native-apply", na.ptr);
    if (xvm) {
      native_apply_set_xvm(xvm);
      x86_symtab_populate_from_mod(xvm_mod(xvm));
    }

    size_t internal_table_size = (size_t) internal_reloc_count * 8;
    size_t external_table_size = (size_t) external_reloc_count * 8;
    size_t vreloc_table_size = (size_t) value_reloc_count * 12;
    const uint8_t *ext_table = bytes + 64 + code_size + data_size + internal_table_size;
    const uint8_t *vreloc_table = ext_table + external_table_size;

    uint32_t strtab_size = read_u32_le(vreloc_table + vreloc_table_size);
    uint32_t native_fn_count = read_u32_le(vreloc_table + vreloc_table_size + 4);

    const uint8_t *strtab = vreloc_table + vreloc_table_size + 8;
    const uint8_t *fn_table = strtab + strtab_size;

    for (uint32_t i = 0; i < native_fn_count; i++) {
      uint32_t name_off = read_u32_le(fn_table + i * 8);
      uint32_t code_off = read_u32_le(fn_table + i * 8 + 4);
      const char *name = (const char *)(strtab + name_off);
      void *entry = (uint8_t *) base + code_off;

      size_t arity = 0;
      if (code_off >= 8) {
        uint8_t *meta = *(uint8_t **) ((uint8_t *) base + code_off - 8);
        if (meta) {
          uint16_t a;
          memory_load(meta, a);
          arity = a;
        }
      }

      function_t *fn = make_function(name);
      fn->arity = arity;
      definition_t *def = make_function_definition((char *) name, fn);
      *(void **)(&def->function_definition.function->buffer) = entry;

      x86_symtab_register(name, (void *)(uint64_t)x_object(def));
      array_push(native_names, (void *) name);
    }

    for (uint32_t i = 0; i < value_reloc_count; i++) {
      uint32_t patch_offset = read_u32_le(vreloc_table + i * 12);
      uint32_t class_off = read_u32_le(vreloc_table + i * 12 + 4);
      uint32_t arg_off = read_u32_le(vreloc_table + i * 12 + 8);
      const char *class_name = (const char *)(strtab + class_off);
      const char *arg = (const char *)(strtab + arg_off);

      value_t v = 0;
      if (string_equal(class_name, "symbol")) {
        v = x_object(intern_symbol(arg));
      } else if (string_equal(class_name, "keyword")) {
        v = x_object(intern_keyword(arg));
      } else if (string_equal(class_name, "string")) {
        v = x_object(make_static_xstring(arg));
      } else if (string_equal(class_name, "definition")) {
        definition_t *def = mod_lookup(xvm_mod(xvm), arg);
        if (def) {
          if (def->kind == PRIMITIVE_DEFINITION) {
            v = x_object(def);
          } else if (def->kind == VARIABLE_DEFINITION) {
            v = def->variable_definition.value;
          }
        } else {
          void *sym = x86_symtab_lookup(arg);
          if (sym) {
            v = (value_t)(uint64_t)sym;
          } else {
            where_printf("[x86_execute_exe] value reloc definition not found: %s\n", arg);
            exit(1);
          }
        }
      }
      *(value_t *) ((uint8_t *) base + patch_offset) = v;
    }

    for (uint32_t i = 0; i < external_reloc_count; i++) {
      uint32_t patch_offset = read_u32_le(ext_table + i * 8);
      uint32_t str_offset = read_u32_le(ext_table + i * 8 + 4);
      const char *name = (const char *)(strtab + str_offset);
      void *addr = x86_symtab_lookup(name);
      if (!addr) {
        where_printf("[x86_execute_exe] unresolved external symbol: %s\n", name);
        exit(1);
      }
      *(uint64_t *) ((uint8_t *) base + patch_offset) = (uint64_t) addr;
    }
  }

  if (mprotect(base, code_region, PROT_READ | PROT_EXEC) == -1) {
    where_printf("[mprotect]: %s\n", strerror(errno));
    munmap(base, image_size);
    exit(1);
  }

  x86_image_t *image = allocate(sizeof(x86_image_t));
  image->base = base;
  image->code_region = code_region;
  image->image_size = image_size;
  image->data_size = (size_t) data_size;
  image->entry_offset = entry_offset;
  image->native_names = native_names;
  image->xvm = xvm;

  if (xvm && external_reloc_count > 0) {
    xvm_push_root(xvm, x_object(xvm));
    native_apply_set_xvm(xvm);
  }

  return image;
}

void *x86_call_native_entry(x86_image_t *image, const char *name,
                             uint8_t argc, value_t *args) {
  (void) image;
  void *p = x86_symtab_lookup(name);
  if (!p) return NULL;
  value_t vt = (value_t)(uint64_t)p;
  if (definition_p(vt)) {
    definition_t *def = to_definition(vt);
    if (def->kind == FUNCTION_DEFINITION) {
      void *fn = *(void **)(&def->function_definition.function->buffer);
      return (void *)(uint64_t)native_call_native_fn(fn, argc, args);
    }
  }
  return (void *)(uint64_t)native_call_native_fn(p, argc, args);
}

void *x86_call_entry(x86_image_t *image) {
  uint8_t *entry = (uint8_t *) image->base + image->entry_offset;
  if (image->xvm) {
    return (void *)(uint64_t)native_call_native_fn(entry, 0, NULL);
  } else {
    fn_t *fn;
    memcpy(&fn, &entry, sizeof(fn));
    return fn();
  }
}

void x86_unload_image(x86_image_t *image) {
  if (image->xvm) {
    xvm_drop_root(image->xvm);
    x86_symtab_free();
  }
  array_free(image->native_names);
  munmap(image->base, image->image_size);
  free(image);
}

array_t *x86_collect_tests(x86_image_t *image) {
  array_t *tests = make_array();

  uint8_t *data_start = (uint8_t *) image->base + image->code_region;
  uint8_t *data_end = data_start + image->data_size;

  for (size_t i = 0; i < array_length(image->native_names); i++) {
    const char *name = (const char *) array_get(image->native_names, i);
    void *p = x86_symtab_lookup(name);
    if (!p) continue;
    value_t vt = (value_t)(uint64_t)p;
    if (!definition_p(vt)) continue;
    definition_t *def = to_definition(vt);

    void *entry;
    memory_load(&def->function_definition.function->buffer, entry);
    if (!entry) continue;

    uint8_t *code_addr = (uint8_t *) entry;
    if (code_addr - (uint8_t *) image->base < 8) continue;
    uint8_t *meta = *(uint8_t **) (code_addr - 8);
    if (!meta || meta < data_start || meta >= data_end) continue;

    uint16_t flags;
    memory_load(meta + 2, flags);
    if (!(flags & 1)) continue;

    array_push(tests, (void *) name);
  }

  return tests;
}
