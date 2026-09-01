#include "index.h"

typedef void *(fn_t)(void);

#define PAGE_SIZE 4096
#define PAGE_ALIGN(s) ((((size_t)(s)) + PAGE_SIZE - 1) & ~(PAGE_SIZE - 1))

// ---------------------------------------------------------------------------
// lifecycle
// ---------------------------------------------------------------------------

x86_exe_t *make_x86_exe(buffer_t *buffer) {
  x86_exe_t *self = new(x86_exe_t);
  memset(self, 0, sizeof(x86_exe_t));
  void *bytes = buffer_raw_bytes(buffer);
  self->header = bytes;
  self->buffer = buffer;
  return self;
}

void x86_exe_free(x86_exe_t *self) {
  if (self->label_map) record_free(self->label_map);
  if (self->image) munmap(self->image, self->image_size);
  buffer_free(self->buffer);
  free(self);
}

// ---------------------------------------------------------------------------
// validation
// ---------------------------------------------------------------------------

void x86_exe_check(x86_exe_t *self) {
  uint8_t magic[8] = {'x', '8', '6', 0, 0, 0, 0, 0};
  assert(memcmp(self->header->magic, magic, 8) == 0);
}

uint64_t x86_exe_version(x86_exe_t *x86) {
  return x86->header->version;
}

// ---------------------------------------------------------------------------
// fixup helpers
// ---------------------------------------------------------------------------

static void *segment_base(x86_exe_t *self, x86_exe_segment_kind_t kind) {
  switch (kind) {
    case X86_CODE_SEGMENT:  return self->code;
    case X86_DATA_SEGMENT:  return self->data;
    case X86_SPACE_SEGMENT: return self->space;
    default: {
      where_printf("[x86_exe_load] unknown segment kind: %lu\n", kind);
      exit(1);
    }
  }
}

static void apply_label_rel32(x86_exe_t *self, const char *name, uint8_t *patch_addr, int64_t addend) {
  // - note: a label at code offset 0 packs to NULL, so check existence
  //   with record_has rather than testing the record_get result.
  if (!record_has(self->label_map, (char *) name)) {
    where_printf("[x86_exe_load] undefined label: %s\n", name);
    exit(1);
  }
  void *packed = record_get(self->label_map, (char *) name);

  x86_exe_segment_kind_t target_kind = X86_LABEL_KIND(packed);
  uint64_t target_offset = X86_LABEL_OFFSET(packed);

  uint8_t *target_base = segment_base(self, target_kind);
  uint64_t target_addr = (uint64_t)(target_base + target_offset);

  // value = S + A - P
  int32_t displacement = (int32_t)((int64_t) target_addr + addend - (int64_t) patch_addr);
  *(int32_t *) patch_addr = displacement;
}

static void apply_label_abs64(x86_exe_t *self, const char *name, uint8_t *patch_addr, int64_t addend) {
  // - note: a label at code offset 0 packs to NULL, so check existence
  //   with record_has rather than testing the record_get result.
  if (!record_has(self->label_map, (char *) name)) {
    where_printf("[x86_exe_load] undefined label: %s\n", name);
    exit(1);
  }
  void *packed = record_get(self->label_map, (char *) name);

  x86_exe_segment_kind_t target_kind = X86_LABEL_KIND(packed);
  uint64_t target_offset = X86_LABEL_OFFSET(packed);

  uint8_t *target_base = segment_base(self, target_kind);
  uint64_t target_addr = (uint64_t)(target_base + target_offset);

  // value = S + A
  *(uint64_t *) patch_addr = (uint64_t)((int64_t) target_addr + addend);
}

// ---------------------------------------------------------------------------
// load: parse → mmap → fixups → mprotect
// ---------------------------------------------------------------------------

void x86_exe_load(x86_exe_t *self) {
  x86_exe_header_t *h = self->header;
  uint8_t *file_start = buffer_raw_bytes(self->buffer);

  // --- parse string table ---

  self->string_table = (const char *)(file_start + h->string_table_file_offset);

  // --- parse label table ---

  self->label_count = h->label_table_size / sizeof(x86_exe_label_entry_t);
  self->label_entries = (x86_exe_label_entry_t *)(file_start + h->label_table_file_offset);

  self->label_map = make_record();

  for (size_t i = 0; i < self->label_count; i++) {
    x86_exe_label_entry_t *entry = &self->label_entries[i];
    const char *name = self->string_table + entry->name;
    record_put(self->label_map,
               (char *) name,
               X86_LABEL_PACK(entry->segment_kind, entry->segment_offset));
  }

  // --- parse fixup table ---

  self->fixup_count = h->fixup_table_size / sizeof(x86_exe_fixup_entry_t);
  self->fixup_entries =
    (x86_exe_fixup_entry_t *)(file_start + h->fixup_table_file_offset);

  // --- mmap image ---

  size_t code_page  = PAGE_ALIGN(h->code_size);
  size_t data_page  = PAGE_ALIGN(h->data_size);
  size_t space_page = PAGE_ALIGN(h->space_size);

  self->image_size = code_page + data_page + space_page;

  self->image = mmap(
    NULL, self->image_size,
    PROT_READ | PROT_WRITE,
    MAP_PRIVATE | MAP_ANONYMOUS,
    -1, 0);

  if (self->image == MAP_FAILED) {
    where_printf("[x86_exe_load] mmap failed: %s\n", strerror(errno));
    exit(1);
  }

  self->code  = (uint8_t *) self->image;
  self->data  = (uint8_t *) self->image + code_page;
  self->space = (uint8_t *) self->image + code_page + data_page;

  self->entry = (uint8_t *) self->code + h->entry_code_segment_offset;

  // --- copy code + data ---

  memcpy(self->code, file_start + h->code_file_offset, h->code_size);
  memcpy(self->data, file_start + h->data_file_offset, h->data_size);

  // --- apply fixups ---

  for (size_t i = 0; i < self->fixup_count; i++) {
    x86_exe_fixup_entry_t *r = &self->fixup_entries[i];
    const char *type = self->string_table + r->type;
    const char *name = self->string_table + r->name;

    uint8_t *patch_addr = (uint8_t *) segment_base(self, r->segment_kind) + r->segment_offset;

    if (string_equal(type, "label-rel32")) {
      apply_label_rel32(self, name, patch_addr, r->addend);
    } else if (string_equal(type, "label-abs64")) {
      apply_label_abs64(self, name, patch_addr, r->addend);
    } else if (string_equal(type, "extern")) {
      where_printf("[x86_exe_load] warning: 'extern' fixup not supported yet\n");
    } else {
      where_printf("[x86_exe_load] warning: unknown fixup type '%s'\n", type);
    }
  }

  // --- mprotect code → RX ---

  if (mprotect(self->code, code_page, PROT_READ | PROT_EXEC) == -1) {
    where_printf("[x86_exe_load] mprotect failed: %s\n", strerror(errno));
    exit(1);
  }
}

// ---------------------------------------------------------------------------
// call entry
// ---------------------------------------------------------------------------

void *x86_exe_call_entry(x86_exe_t *self) {
  fn_t *fn;
  memcpy(&fn, &self->entry, sizeof(fn));
  return fn();
}
