#include "index.h"

typedef void *(fn_t)(void);

#define PAGE_SIZE 4096
#define PAGE_ALIGN(s) ((((size_t)(s)) + PAGE_SIZE - 1) & ~(PAGE_SIZE - 1))

// ---------------------------------------------------------------------------
// lifecycle
// ---------------------------------------------------------------------------

xexe_t *make_xexe(buffer_t *buffer) {
  xexe_t *self = new(xexe_t);
  memset(self, 0, sizeof(xexe_t));
  void *bytes = buffer_raw_bytes(buffer);
  self->header = bytes;
  self->buffer = buffer;
  return self;
}

void xexe_free(xexe_t *self) {
  if (self->label_map) record_free(self->label_map);
  if (self->image) munmap(self->image, self->image_size);
  buffer_free(self->buffer);
  free(self);
}

// ---------------------------------------------------------------------------
// validation
// ---------------------------------------------------------------------------

void xexe_check(xexe_t *self) {
  uint8_t magic[8] = {'x', 'e', 'x', 'e', 0, 0, 0, 0};
  uint8_t machine[8] = {'x', '8', '6', '-', '6', '4', 0, 0};
  assert(memcmp(self->header->magic, magic, 8) == 0);
  assert(memcmp(self->header->machine, machine, 8) == 0);
}

uint64_t xexe_version(xexe_t *xexe) {
  return xexe->header->version;
}

// ---------------------------------------------------------------------------
// relocation helpers
// ---------------------------------------------------------------------------

static void *segment_base(xexe_t *self, xexe_segment_kind_t kind) {
  switch (kind) {
    case XEXE_CODE_SEGMENT:  return self->code;
    case XEXE_DATA_SEGMENT:  return self->data;
    case XEXE_SPACE_SEGMENT: return self->space;
    default: {
      where_printf("[xexe_load] unknown segment kind: %lu\n", kind);
      exit(1);
    }
  }
}

static void apply_label_rel32(xexe_t *self, const char *name, uint8_t *patch_addr) {
  void *packed = record_get(self->label_map, (char *) name);
  if (!packed) {
    where_printf("[xexe_load] undefined label: %s\n", name);
    exit(1);
  }

  xexe_segment_kind_t target_kind = XEXE_LABEL_KIND(packed);
  uint64_t target_offset = XEXE_LABEL_OFFSET(packed);

  uint8_t *target_base = segment_base(self, target_kind);
  uint64_t target_addr = (uint64_t)(target_base + target_offset);
  uint64_t rip = (uint64_t) patch_addr + 4;

  int32_t displacement = (int32_t)(target_addr - rip);
  *(int32_t *) patch_addr = displacement;
}

static void apply_label_abs64(xexe_t *self, const char *name, uint8_t *patch_addr) {
  void *packed = record_get(self->label_map, (char *) name);
  if (!packed) {
    where_printf("[xexe_load] undefined label: %s\n", name);
    exit(1);
  }

  xexe_segment_kind_t target_kind = XEXE_LABEL_KIND(packed);
  uint64_t target_offset = XEXE_LABEL_OFFSET(packed);

  uint8_t *target_base = segment_base(self, target_kind);
  uint64_t target_addr = (uint64_t)(target_base + target_offset);

  *(uint64_t *) patch_addr = target_addr;
}

// ---------------------------------------------------------------------------
// load: parse → mmap → relocations → mprotect
// ---------------------------------------------------------------------------

void xexe_load(xexe_t *self) {
  xexe_header_t *h = self->header;
  uint8_t *file_start = buffer_raw_bytes(self->buffer);

  // --- parse string table ---

  self->string_table = (const char *)(file_start + h->string_table_file_offset);

  // --- parse label table ---

  self->label_count = h->label_table_size / sizeof(xexe_label_entry_t);
  self->label_entries = (xexe_label_entry_t *)(file_start + h->label_table_file_offset);

  self->label_map = make_record();

  for (size_t i = 0; i < self->label_count; i++) {
    xexe_label_entry_t *entry = &self->label_entries[i];
    const char *name = self->string_table + entry->name;
    record_put(self->label_map,
               (char *) name,
               XEXE_LABEL_PACK(entry->segment_kind, entry->segment_offset));
  }

  // --- parse relocation table ---

  self->relocation_count = h->relocation_table_size / sizeof(xexe_relocation_entry_t);
  self->relocation_entries =
    (xexe_relocation_entry_t *)(file_start + h->relocation_table_file_offset);

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
    where_printf("[xexe_load] mmap failed: %s\n", strerror(errno));
    exit(1);
  }

  self->code  = (uint8_t *) self->image;
  self->data  = (uint8_t *) self->image + code_page;
  self->space = (uint8_t *) self->image + code_page + data_page;

  self->entry = (uint8_t *) self->code + h->entry_code_segment_offset;

  // --- copy code + data ---

  memcpy(self->code, file_start + h->code_file_offset, h->code_size);
  memcpy(self->data, file_start + h->data_file_offset, h->data_size);

  // --- apply relocations ---

  for (size_t i = 0; i < self->relocation_count; i++) {
    xexe_relocation_entry_t *r = &self->relocation_entries[i];
    const char *type = self->string_table + r->type;
    const char *name = self->string_table + r->name;

    uint8_t *patch_addr = (uint8_t *) segment_base(self, r->segment_kind) + r->segment_offset;

    if (string_equal(type, "label-rel32")) {
      apply_label_rel32(self, name, patch_addr);
    } else if (string_equal(type, "label-abs64")) {
      apply_label_abs64(self, name, patch_addr);
    } else if (string_equal(type, "extern")) {
      where_printf("[xexe_load] warning: 'extern' relocation not supported yet\n");
    } else {
      where_printf("[xexe_load] warning: unknown relocation type '%s'\n", type);
    }
  }

  // --- mprotect code → RX ---

  if (mprotect(self->code, code_page, PROT_READ | PROT_EXEC) == -1) {
    where_printf("[xexe_load] mprotect failed: %s\n", strerror(errno));
    exit(1);
  }
}

// ---------------------------------------------------------------------------
// call entry
// ---------------------------------------------------------------------------

void *xexe_call_entry(xexe_t *self) {
  fn_t *fn;
  memcpy(&fn, &self->entry, sizeof(fn));
  return fn();
}
