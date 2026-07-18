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
};

struct xexe_t {
  xexe_header_t *header;
  buffer_t *buffer; // owns the buffer.
};

xexe_t *make_xexe(buffer_t *buffer);
void xexe_free(xexe_t *self);

uint64_t xexe_version(xexe_t *self);
