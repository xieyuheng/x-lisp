#pragma once

typedef uint64_t value_t;

// value = 61 bits payload + 3 bits tag.

#define PAYLOAD_MASK ((uint64_t) 0xfffffffffffffff8)
#define TAG_MASK ((uint64_t) 0b111)

typedef enum {
  X_INT     = 0b000,
  X_FLOAT     = 0b001,
  //      = 0b010,
  //      = 0b011,
  //      = 0b100,
  //      = 0b101,
  X_IMMEDIATE   = 0b110,
  X_OBJECT    = 0b111,
} tag_t;

typedef struct symbol_t symbol_t;
typedef struct keyword_t keyword_t;
typedef struct curry_t curry_t;
typedef struct curry_child_iter_t curry_child_iter_t;
typedef struct xstring_t xstring_t;
typedef struct xlist_t xlist_t;
typedef struct xlist_child_iter_t xlist_child_iter_t;
typedef struct xrecord_t xrecord_t;
typedef struct xrecord_child_iter_t xrecord_child_iter_t;
typedef struct xhash_t xhash_t;
typedef struct xhash_child_iter_t xhash_child_iter_t;
typedef struct xset_t xset_t;
typedef struct xset_child_iter_t xset_child_iter_t;
typedef struct xfile_t xfile_t;
