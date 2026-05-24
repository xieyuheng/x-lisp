#pragma once

#include <stdint.h>

typedef struct xexe_t xexe_t;

#define XEXE_MAGIC   ((uint32_t) 0x58455845)
#define XEXE_VERSION ((uint32_t) 1)

enum {
  XEXE_DEF_FUNCTION = 0,
  XEXE_DEF_VARIABLE = 2,
};

enum {
  XEXE_VALUE_KEYWORD = 1,
  XEXE_VALUE_STRING  = 2,
  XEXE_VALUE_SYMBOL  = 3,
};

#define XEXE_FLAG_IS_TEST 0x01

#define XEXE_HEADER_SIZE 28
