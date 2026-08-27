#pragma once

#include <stdint.h>

typedef struct mod_t mod_t;
typedef struct primitive_t primitive_t;
typedef struct function_t function_t;
typedef struct definition_t definition_t;
typedef struct frame_t frame_t;
typedef struct xvm_t xvm_t;
typedef struct xvm_exe_t xvm_exe_t;

#define XVM_EXE_MAGIC   ((uint32_t) 0x006D7678)
#define XVM_EXE_VERSION ((uint32_t) 1)

enum {
  XVM_EXE_DEF_FUNCTION = 0,
  XVM_EXE_DEF_VARIABLE = 1,
};

enum {
  XVM_EXE_VALUE_STRING  = 2,
  XVM_EXE_VALUE_SYMBOL  = 3,
};

#define XVM_EXE_FLAG_IS_TEST 0x01

#define XVM_EXE_HEADER_SIZE 32
