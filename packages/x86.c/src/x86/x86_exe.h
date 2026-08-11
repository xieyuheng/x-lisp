#pragma once

struct __attribute__((packed)) x86_exe_header_t {
  // - note: every field is 8 bytes.

  uint8_t magic[8]; // "x86\0\0\0\0" magic number
  uint64_t version;

  uint64_t code_file_offset;
  uint64_t code_size;
  uint64_t entry_code_segment_offset;

  uint64_t data_file_offset;
  uint64_t data_size;

  uint64_t space_size;

  uint64_t string_table_file_offset;
  uint64_t string_table_size;

  uint64_t label_table_file_offset;
  uint64_t label_table_size;

  uint64_t relocation_table_file_offset;
  uint64_t relocation_table_size;
};

// - note: string in string table must be unique,
//   so that we can compare string by pointer.

typedef uint64_t x86_exe_string_t; // offset to string table

// - note: every field is 8 bytes.

typedef uint64_t x86_exe_segment_kind_t;

#define X86_CODE_SEGMENT 0
#define X86_DATA_SEGMENT 1
#define X86_SPACE_SEGMENT 2

struct __attribute__((packed)) x86_exe_label_entry_t {
  x86_exe_string_t name;
  x86_exe_segment_kind_t segment_kind;
  uint64_t segment_offset;
};

struct __attribute__((packed)) x86_exe_relocation_entry_t {
  x86_exe_string_t type;
  x86_exe_string_t name;
  x86_exe_segment_kind_t segment_kind;
  uint64_t segment_offset;
  // - note: constant addend. For label-rel32 the assembler computes
  //   addend = -(rip - hole), so the loader applies S + A - P directly.
  int64_t addend;
};

// Pack {kind, offset} into void* for the label_map record_t.
// offset is segment-relative and guaranteed < 2G, so 32 bits suffice.
// - note: a label at code offset 0 packs to NULL; callers must use
//   record_has to check existence before record_get.

#define X86_LABEL_PACK(kind, offset) \
  ((void *)(uint64_t)(((uint64_t)(kind) << 32) | ((uint64_t)(offset) & 0xFFFFFFFF)))

#define X86_LABEL_KIND(packed) \
  ((x86_exe_segment_kind_t)((uint64_t)(packed) >> 32))

#define X86_LABEL_OFFSET(packed) \
  ((uint64_t)(packed) & 0xFFFFFFFF)

struct x86_exe_t {
  x86_exe_header_t *header;
  buffer_t *buffer; // owns the buffer.

  // mmap'd image
  void *image;
  size_t image_size;
  void *code;
  void *data;
  void *space;
  void *entry; // code + entry_code_segment_offset

  // parsed tables — pointers into buffer, no copy
  const char *string_table;
  x86_exe_label_entry_t *label_entries;
  size_t label_count;
  x86_exe_relocation_entry_t *relocation_entries;
  size_t relocation_count;

  // label name → X86_LABEL_PACK(kind, segment_offset)
  record_t *label_map;
};

x86_exe_t *make_x86_exe(buffer_t *buffer);
void x86_exe_free(x86_exe_t *self);

void x86_exe_check(x86_exe_t *self);
uint64_t x86_exe_version(x86_exe_t *self);

void x86_exe_load(x86_exe_t *self);
void *x86_exe_call_entry(x86_exe_t *self);
