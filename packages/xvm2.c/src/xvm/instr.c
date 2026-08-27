#include "index.h"

typedef enum { FIXED, CALL, APPLY } enc_kind_t;

struct instr_enc_t {
  enc_kind_t kind;
  uint8_t header_size;
};

#define SZU16  sizeof(uint16_t)
#define SZI32  sizeof(int32_t)
#define SZVAL  sizeof(value_t)
#define SZPTR  sizeof(definition_t *)

static inline void enc_u16(uint8_t *p, uint16_t v)   { memory_copy(p, &v, sizeof(v)); }
static inline void enc_i32(uint8_t *p, int32_t v)     { memory_copy(p, &v, sizeof(v)); }
static inline void enc_val(uint8_t *p, value_t v)      { memory_copy(p, &v, sizeof(v)); }
static inline void enc_ptr(uint8_t *p, definition_t *v) { memory_copy(p, &v, sizeof(v)); }

static const struct instr_enc_t ENC[] = {
  [OP_MOVE]        = { FIXED, 1 + SZU16 + SZU16 },
  [OP_LOAD]        = { FIXED, 1 + SZU16 + SZVAL },
  [OP_LOAD_RESULT] = { FIXED, 1 + SZU16 },
  [OP_RETURN]      = { FIXED, 1 + SZU16 },
  [OP_CALL]        = { CALL,  1 + SZPTR + 1 },
  [OP_TAIL_CALL]   = { CALL,  1 + SZPTR + 1 },
  [OP_REF]         = { FIXED, 1 + SZU16 + SZPTR },
  [OP_GLOBAL_LOAD] = { FIXED, 1 + SZU16 + SZPTR },
  [OP_GLOBAL_STORE]= { FIXED, 1 + SZU16 + SZPTR },
  [OP_APPLY]       = { APPLY, 1 + SZU16 + 1 },
  [OP_TAIL_APPLY]  = { APPLY, 1 + SZU16 + 1 },
  [OP_JUMP]        = { FIXED, 1 + SZI32 },
  [OP_JUMP_IF_NOT] = { FIXED, 1 + SZU16 + SZI32 },
  [OP_IADD]        = { FIXED, 1 + SZU16 + SZU16 + SZU16 },
  [OP_ISUB]        = { FIXED, 1 + SZU16 + SZU16 + SZU16 },
  [OP_IMUL]        = { FIXED, 1 + SZU16 + SZU16 + SZU16 },
  [OP_IDIV]        = { FIXED, 1 + SZU16 + SZU16 + SZU16 },
  [OP_IMOD]        = { FIXED, 1 + SZU16 + SZU16 + SZU16 },
  [OP_INEG]        = { FIXED, 1 + SZU16 + SZU16 },
  [OP_INT_GREATER] = { FIXED, 1 + SZU16 + SZU16 + SZU16 },
  [OP_INT_LESS]    = { FIXED, 1 + SZU16 + SZU16 + SZU16 },
  [OP_INT_GREATER_OR_EQUAL] = { FIXED, 1 + SZU16 + SZU16 + SZU16 },
  [OP_INT_LESS_OR_EQUAL]    = { FIXED, 1 + SZU16 + SZU16 + SZU16 },
  [OP_INT_POSITIVE]        = { FIXED, 1 + SZU16 + SZU16 },
  [OP_INT_NON_NEGATIVE]    = { FIXED, 1 + SZU16 + SZU16 },
  [OP_INT_NON_ZERO]        = { FIXED, 1 + SZU16 + SZU16 },
};

size_t instr_length(struct instr_t instr) {
  size_t n = ENC[instr.op].header_size;
  if (ENC[instr.op].kind == CALL)
    n += instr.call.argc * SZU16;
  if (ENC[instr.op].kind == APPLY)
    n += instr.apply.argc * SZU16;
  return n;
}

struct instr_t instr_decode_header(uint8_t *code) {
  struct instr_t instr = {0};
  instr.op = code[0];
  switch (instr.op) {
  case OP_CALL:
  case OP_TAIL_CALL:
    instr.call.argc = code[1 + SZPTR];
    break;
  case OP_APPLY:
  case OP_TAIL_APPLY:
    instr.apply.argc = code[1 + SZU16];
    break;
  default:
    break;
  }
  return instr;
}

void instr_encode(uint8_t *code, struct instr_t instr) {
  code[0] = instr.op;

  switch (ENC[instr.op].kind) {
  case FIXED: {
    switch (instr.op) {
    case OP_MOVE:
      enc_u16(code + 1, instr.mov.dst);
      enc_u16(code + 1 + SZU16, instr.mov.src);
      return;
    case OP_LOAD:
      enc_u16(code + 1, instr.load.dst);
      enc_val(code + 1 + SZU16, instr.load.value);
      return;
    case OP_LOAD_RESULT:
      enc_u16(code + 1, instr.load_result.dst);
      return;
    case OP_RETURN:
      enc_u16(code + 1, instr.ret.src);
      return;
    case OP_REF:
      enc_u16(code + 1, instr.ref.dst);
      enc_ptr(code + 1 + SZU16, instr.ref.definition);
      return;
    case OP_GLOBAL_LOAD:
      enc_u16(code + 1, instr.global_load.dst);
      enc_ptr(code + 1 + SZU16, instr.global_load.definition);
      return;
    case OP_GLOBAL_STORE:
      enc_u16(code + 1, instr.global_store.src);
      enc_ptr(code + 1 + SZU16, instr.global_store.definition);
      return;
    case OP_JUMP:
      enc_i32(code + 1, instr.jump.offset);
      return;
    case OP_JUMP_IF_NOT:
      enc_u16(code + 1, instr.jump_if_not.src);
      enc_i32(code + 1 + SZU16, instr.jump_if_not.offset);
      return;
    case OP_IADD:
    case OP_ISUB:
    case OP_IMUL:
    case OP_IDIV:
    case OP_IMOD:
    case OP_INT_GREATER:
    case OP_INT_LESS:
    case OP_INT_GREATER_OR_EQUAL:
    case OP_INT_LESS_OR_EQUAL:
      enc_u16(code + 1, instr.arith.dst);
      enc_u16(code + 1 + SZU16, instr.arith.src1);
      enc_u16(code + 1 + SZU16 + SZU16, instr.arith.src2);
      return;
    case OP_INEG:
    case OP_INT_POSITIVE:
    case OP_INT_NON_NEGATIVE:
    case OP_INT_NON_ZERO:
      enc_u16(code + 1, instr.unary.dst);
      enc_u16(code + 1 + SZU16, instr.unary.src);
      return;
    default:
      unreachable();
    }
  }

  case CALL: {
    enc_ptr(code + 1, instr.call.definition);
    code[1 + SZPTR] = instr.call.argc;
    for (size_t i = 0; i < instr.call.argc; i++)
      enc_u16(code + 1 + SZPTR + 1 + i * SZU16, instr.call.args[i]);
    return;
  }

  case APPLY: {
    enc_u16(code + 1, instr.apply.target);
    code[1 + SZU16] = instr.apply.argc;
    for (size_t i = 0; i < instr.apply.argc; i++)
      enc_u16(code + 1 + SZU16 + 1 + i * SZU16, instr.apply.args[i]);
    return;
  }
  }
}
