#pragma once

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

struct instr_t {
  op_t op;
  union {
    struct { uint16_t dest; uint16_t src; } mov;
    struct { uint16_t dest; value_t value; } load;
    struct { uint16_t dest; } load_result;
    struct { uint16_t src; } ret;
    struct { definition_t *definition; uint8_t argc; uint16_t *args; } call;
    struct { uint16_t target; uint8_t argc; uint16_t *args; } apply;
    struct { uint16_t dest; definition_t *definition; } ref;
    struct { uint16_t dest; definition_t *definition; } global_load;
    struct { uint16_t src; definition_t *definition; } global_store;
    struct { int32_t offset; } jump;
    struct { uint16_t src; int32_t offset; } jump_if_not;
    struct { uint16_t dest; uint16_t src1; uint16_t src2; } arith;
    struct { uint16_t dest; uint16_t src; } unary;
  };
};

size_t instr_length(struct instr_t instr);
struct instr_t instr_decode_header(uint8_t *code);
void instr_encode(uint8_t *code, struct instr_t instr);
