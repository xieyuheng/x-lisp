#pragma once

typedef enum {
    OP_LITERAL,
    OP_RETURN,
    OP_CALL,
    OP_TAIL_CALL,
    OP_REF,
    OP_APPLY,
    OP_TAIL_APPLY,
    OP_ASSIGN,
    OP_LOCAL_LOAD,
    OP_LOCAL_STORE,
    OP_JUMP,
    OP_JUMP_IF_NOT,
    OP_DROP,
} op_t;
