#include "index.h"

size_t instr_length(struct instr_t instr) {
  switch (instr.op) {
  case OP_LITERAL: {
    return 1 + sizeof(value_t);
  }

  case OP_RETURN: {
    return 1;
  }

  case OP_CALL:
  case OP_TAIL_CALL:
  case OP_REF: {
    return 1 + sizeof(definition_t *);
  }

  case OP_GLOBAL_LOAD:
  case OP_GLOBAL_STORE: {
    return 1 + sizeof(definition_t *);
  }

  case OP_APPLY:
  case OP_TAIL_APPLY: {
    return 1 + sizeof(uint8_t);
  }

  case OP_LOCAL_LOAD:
  case OP_LOCAL_STORE: {
    return 1 + sizeof(uint32_t);
  }

  case OP_JUMP:
  case OP_JUMP_IF_NOT: {
    return 1 + sizeof(int32_t);
  }

  case OP_DROP: {
    return 1;
  }
  }

  unreachable();
}

void instr_encode(uint8_t *code, struct instr_t instr) {
  switch (instr.op) {
  case OP_LITERAL: {
    memory_store(code + 0, instr.op);
    memory_store(code + 1, instr.literal.value);
    return;
  }

  case OP_RETURN: {
    memory_store(code + 0, instr.op);
    return;
  }

  case OP_CALL: {
    memory_store(code + 0, instr.op);
    memory_store(code + 1, instr.ref.definition);
    return;
  }

  case OP_TAIL_CALL: {
    memory_store(code + 0, instr.op);
    memory_store(code + 1, instr.ref.definition);
    return;
  }

  case OP_REF: {
    memory_store(code + 0, instr.op);
    memory_store(code + 1, instr.ref.definition);
    return;
  }

  case OP_GLOBAL_LOAD:
  case OP_GLOBAL_STORE: {
    memory_store(code + 0, instr.op);
    memory_store(code + 1, instr.ref.definition);
    return;
  }

  case OP_APPLY:
  case OP_TAIL_APPLY: {
    memory_store(code + 0, instr.op);
    memory_store(code + 1, instr.apply.argc);
    return;
  }

  case OP_LOCAL_LOAD: {
    memory_store(code + 0, instr.op);
    memory_store(code + 1, instr.local.index);
    return;
  }

  case OP_LOCAL_STORE: {
    memory_store(code + 0, instr.op);
    memory_store(code + 1, instr.local.index);
    return;
  }

  case OP_JUMP: {
    memory_store(code + 0, instr.op);
    memory_store(code + 1, instr.jump.offset);
    return;
  }

  case OP_JUMP_IF_NOT: {
    memory_store(code + 0, instr.op);
    memory_store(code + 1, instr.jump.offset);
    return;
  }

  case OP_DROP: {
    memory_store(code + 0, instr.op);
    return;
  }
  }

  unreachable();
}


