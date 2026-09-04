#pragma once

#include <stdint.h>

typedef struct program_t program_t;
typedef struct function_t function_t;
typedef struct primitive_entry_t primitive_entry_t;
typedef struct closure_t closure_t;
typedef struct frame_t frame_t;
typedef struct xvm_t xvm_t;

typedef void (*primitive_fn_t)(void);
