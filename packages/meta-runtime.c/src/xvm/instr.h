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
} op_t;

struct instr_t {
  op_t op;
  union {
    struct { uint16_t dst; uint16_t src; } mov;
    struct { uint16_t dst; value_t value; } load;
    struct { uint16_t dst; } load_result;
    struct { uint16_t src; } ret;
    struct { definition_t *definition; uint8_t argc; uint16_t *args; } call;
    struct { uint16_t target; uint8_t argc; uint16_t *args; } apply;
    struct { uint16_t dst; definition_t *definition; } ref;
    struct { uint16_t dst; definition_t *definition; } global_load;
    struct { uint16_t src; definition_t *definition; } global_store;
    struct { int32_t offset; } jump;
    struct { uint16_t src; int32_t offset; } jump_if_not;
  };
};

size_t instr_length(struct instr_t instr);
struct instr_t instr_decode_header(uint8_t *code);
void instr_encode(uint8_t *code, struct instr_t instr);
