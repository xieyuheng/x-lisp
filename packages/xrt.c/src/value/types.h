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

// function pointer types for builtin primitives

typedef value_t (x_fn_0_t)(void);
typedef value_t (x_fn_1_t)(value_t x1);
typedef value_t (x_fn_2_t)(value_t x1, value_t x2);
typedef value_t (x_fn_3_t)(value_t x1, value_t x2, value_t x3);
typedef value_t (x_fn_4_t)(value_t x1, value_t x2, value_t x3, value_t x4);
typedef value_t (x_fn_5_t)(value_t x1, value_t x2, value_t x3, value_t x4, value_t x5);
typedef value_t (x_fn_6_t)(value_t x1, value_t x2, value_t x3, value_t x4, value_t x5, value_t x6);

typedef struct definition_t definition_t;
typedef struct symbol_t symbol_t;
typedef struct keyword_t keyword_t;
typedef struct xtext_t xtext_t;
typedef struct xlist_t xlist_t;
typedef struct xlist_child_iter_t xlist_child_iter_t;
typedef struct xhash_t xhash_t;
typedef struct xhash_child_iter_t xhash_child_iter_t;
typedef struct xset_t xset_t;
typedef struct xset_child_iter_t xset_child_iter_t;
typedef struct xfile_t xfile_t;
