#pragma once

typedef uint64_t value_t;

// value = 61 bits payload + 3 bits tag.

#define PAYLOAD_MASK ((uint64_t) 0xfffffffffffffff8)
#define TAG_MASK ((uint64_t) 0b111)

typedef enum {
    X_INT         = 0b000,
    X_FLOAT       = 0b001,
    X_SYMBOL      = 0b010,
    X_LITTLE      = 0b011,
    //            = 0b100,
    //            = 0b101,
    //            = 0b110,
    X_OBJECT      = 0b111,
} tag_t;

typedef struct symbol_t symbol_t;
typedef struct curry_t curry_t;
typedef struct xstring_t xstring_t;
typedef struct tael_t tael_t;
