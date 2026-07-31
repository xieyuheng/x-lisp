#pragma once

struct __attribute__((packed)) xexe_header_t {
  // - why: every field is 8 bytes,
  //   because arm and risc-v require 8 bytes alignment.

  uint8_t magic[8]; // "xexe\0\0\0\0" magic number
  uint8_t machine[8]; // "x86-64\0\0"
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

typedef uint64_t xexe_string_t; // offset to string table

// - why: every field is 8 bytes,
//   because arm and risc-v require 8 bytes alignment.

typedef uint64_t xexe_segment_kind_t;

#define XEXE_CODE_SEGMENT 0
#define XEXE_DATA_SEGMENT 1
#define XEXE_SPACE_SEGMENT 2

struct __attribute__((packed)) xexe_label_entry_t {
  xexe_string_t name;
  xexe_segment_kind_t segment_kind;
  uint64_t segment_offset;
};

struct __attribute__((packed)) xexe_relocation_entry_t {
  xexe_string_t type;
  xexe_string_t name;
  xexe_segment_kind_t segment_kind;
  uint64_t segment_offset;
  // - note: constant addend. For label-rel32 the assembler computes
  //   addend = -(rip - hole), so the loader applies S + A - P directly.
  int64_t addend;
};

// Pack {kind, offset} into void* for the label_map record_t.
// offset is segment-relative and guaranteed < 2G, so 32 bits suffice.

#define XEXE_LABEL_PACK(kind, offset) \
  ((void *)(uint64_t)(((uint64_t)(kind) << 32) | ((uint64_t)(offset) & 0xFFFFFFFF)))

#define XEXE_LABEL_KIND(packed) \
  ((xexe_segment_kind_t)((uint64_t)(packed) >> 32))

#define XEXE_LABEL_OFFSET(packed) \
  ((uint64_t)(packed) & 0xFFFFFFFF)

struct xexe_t {
  xexe_header_t *header;
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
  xexe_label_entry_t *label_entries;
  size_t label_count;
  xexe_relocation_entry_t *relocation_entries;
  size_t relocation_count;

  // label name → XEXE_LABEL_PACK(kind, segment_offset)
  record_t *label_map;
};

xexe_t *make_xexe(buffer_t *buffer);
void xexe_free(xexe_t *self);

void xexe_check(xexe_t *self);
uint64_t xexe_version(xexe_t *self);

void xexe_load(xexe_t *self);
void *xexe_call_entry(xexe_t *self);
