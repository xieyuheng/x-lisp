#pragma once

typedef enum {
    OP_NOP,

    OP_INT,
    OP_IADD,
    OP_ISUB,
    OP_IMUL,
    OP_IDIV,
    OP_IMOD,

    OP_FLOAT,
    OP_FADD,
    OP_FSUB,
    OP_FMUL,
    OP_FDIV,
    OP_FMOD,

    OP_CALL,
    OP_TAIL_CALL,
    OP_RETURN,

    OP_VAR_LOAD,
    OP_VAR_STORE,
    OP_CONST_LOAD,

    OP_JUMP,
    OP_JUMP_IF_NOT,

    OP_STRING,
    // TODO
} op_t;
