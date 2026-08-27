#pragma once

#include <stdint.h>

typedef struct mod_t mod_t;
typedef struct primitive_t primitive_t;
typedef struct function_t function_t;
typedef struct definition_t definition_t;
typedef struct frame_t frame_t;
typedef struct xvm_t xvm_t;

typedef enum {
  OP_MOVE,
  OP_LOAD,
  OP_LOAD_RESULT,
  OP_RETURN,
  OP_CALL,
  OP_TAIL_CALL,
  OP_REF,
  OP_GLOBAL_LOAD,
  OP_GLOBAL_STORE,
  OP_APPLY,
  OP_TAIL_APPLY,
  OP_JUMP,
  OP_JUMP_IF_NOT,
  OP_IADD,
  OP_ISUB,
  OP_IMUL,
  OP_IDIV,
  OP_IMOD,
  OP_INEG,
  OP_INT_GREATER,
  OP_INT_LESS,
  OP_INT_GREATER_OR_EQUAL,
  OP_INT_LESS_OR_EQUAL,
  OP_INT_POSITIVE,
  OP_INT_NON_NEGATIVE,
  OP_INT_NON_ZERO,
} op_t;
