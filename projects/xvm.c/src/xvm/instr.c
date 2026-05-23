#include "index.h"

size_t instr_length(struct instr_t instr) {
  switch (instr.op) {
  case OP_MOVE: {
    return 1 + sizeof(uint16_t) + sizeof(uint16_t);
  }

  case OP_LOAD: {
    return 1 + sizeof(uint16_t) + sizeof(value_t);
  }

  case OP_LOAD_RESULT: {
    return 1 + sizeof(uint16_t);
  }

  case OP_RETURN: {
    return 1 + sizeof(uint16_t);
  }

  case OP_CALL:
  case OP_TAIL_CALL: {
    return 1 + sizeof(definition_t *) + sizeof(uint8_t)
      + instr.call.argc * sizeof(uint16_t);
  }

  case OP_APPLY:
  case OP_TAIL_APPLY: {
    return 1 + sizeof(uint16_t) + sizeof(uint8_t)
      + instr.apply.argc * sizeof(uint16_t);
  }

  case OP_REF:
  case OP_GLOBAL_LOAD:
  case OP_GLOBAL_STORE: {
    return 1 + sizeof(uint16_t) + sizeof(definition_t *);
  }

  case OP_JUMP: {
    return 1 + sizeof(int32_t);
  }

  case OP_JUMP_IF_NOT: {
    return 1 + sizeof(uint16_t) + sizeof(int32_t);
  }
  }

  unreachable();
}

void instr_encode(uint8_t *code, struct instr_t instr) {
  switch (instr.op) {
  case OP_MOVE: {
    memory_store(code + 1, instr.mov.dst);
    memory_store(code + 1 + sizeof(uint16_t), instr.mov.src);
    code[0] = instr.op;
    return;
  }

  case OP_LOAD: {
    memory_store(code + 1, instr.load.dst);
    memory_store(code + 1 + sizeof(uint16_t), instr.load.value);
    code[0] = instr.op;
    return;
  }

  case OP_LOAD_RESULT: {
    memory_store(code + 1, instr.load_result.dst);
    code[0] = instr.op;
    return;
  }

  case OP_RETURN: {
    memory_store(code + 1, instr.ret.src);
    code[0] = instr.op;
    return;
  }

  case OP_CALL: {
    memory_store(code + 1, instr.call.definition);
    code[1 + sizeof(definition_t *)] = instr.call.argc;
    for (size_t i = 0; i < instr.call.argc; i++) {
      memory_store(code + 1 + sizeof(definition_t *) + sizeof(uint8_t) + i * sizeof(uint16_t),
                   instr.call.args[i]);
    }
    code[0] = instr.op;
    return;
  }

  case OP_TAIL_CALL: {
    memory_store(code + 1, instr.tail_call.definition);
    code[1 + sizeof(definition_t *)] = instr.tail_call.argc;
    for (size_t i = 0; i < instr.tail_call.argc; i++) {
      memory_store(code + 1 + sizeof(definition_t *) + sizeof(uint8_t) + i * sizeof(uint16_t),
                   instr.tail_call.args[i]);
    }
    code[0] = instr.op;
    return;
  }

  case OP_APPLY: {
    memory_store(code + 1, instr.apply.target);
    code[1 + sizeof(uint16_t)] = instr.apply.argc;
    for (size_t i = 0; i < instr.apply.argc; i++) {
      memory_store(code + 1 + sizeof(uint16_t) + sizeof(uint8_t) + i * sizeof(uint16_t),
                   instr.apply.args[i]);
    }
    code[0] = instr.op;
    return;
  }

  case OP_TAIL_APPLY: {
    memory_store(code + 1, instr.tail_apply.target);
    code[1 + sizeof(uint16_t)] = instr.tail_apply.argc;
    for (size_t i = 0; i < instr.tail_apply.argc; i++) {
      memory_store(code + 1 + sizeof(uint16_t) + sizeof(uint8_t) + i * sizeof(uint16_t),
                   instr.tail_apply.args[i]);
    }
    code[0] = instr.op;
    return;
  }

  case OP_REF: {
    memory_store(code + 1, instr.ref.dst);
    memory_store(code + 1 + sizeof(uint16_t), instr.ref.definition);
    code[0] = instr.op;
    return;
  }

  case OP_GLOBAL_LOAD: {
    memory_store(code + 1, instr.global_load.dst);
    memory_store(code + 1 + sizeof(uint16_t), instr.global_load.definition);
    code[0] = instr.op;
    return;
  }

  case OP_GLOBAL_STORE: {
    memory_store(code + 1, instr.global_store.src);
    memory_store(code + 1 + sizeof(uint16_t), instr.global_store.definition);
    code[0] = instr.op;
    return;
  }

  case OP_JUMP: {
    memory_store(code + 1, instr.jump.offset);
    code[0] = instr.op;
    return;
  }

  case OP_JUMP_IF_NOT: {
    memory_store(code + 1, instr.jump_if_not.src);
    memory_store(code + 1 + sizeof(uint16_t), instr.jump_if_not.offset);
    code[0] = instr.op;
    return;
  }
  }

  unreachable();
}
