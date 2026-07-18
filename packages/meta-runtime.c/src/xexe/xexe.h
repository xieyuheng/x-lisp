#pragma once

struct __attribute__((packed)) xexe_header_t {
  uint8_t magic[4]; // "xexe" magic number
  uint64_t code_size;
  uint64_t data_size;
  uint64_t space_size;
  uint64_t entry_offset; // offset to code segment
  uint64_t label_count;
  uint64_t relocation_count;
  uint8_t reserved[12]; // padding to 64 bytes
};

_Static_assert(sizeof(xexe_header_t) == 64, "xexe_header_t must be exactly 64 bytes");

typedef uint64_t xexe_string_t; // offset to string table

typedef uint8_t xexe_segment_kind_t;

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
