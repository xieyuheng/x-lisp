#include "index.h"

size_t
instr_length(struct instr_t instr) {
    switch (instr.op) {
    case OP_LITERAL_INT: {
        return 1 + sizeof(int64_t);
    }

    case OP_LITERAL_FLOAT: {
        return 1 + sizeof(double);
    }

    case OP_CALL:
    case OP_TAIL_CALL:
    case OP_CONST_LOAD:
    case OP_VAR_LOAD:
    case OP_VAR_STORE: {
        return 1 + sizeof(definition_t *);
    }

    case OP_LOCAL_LOAD:
    case OP_LOCAL_STORE: {
        return 1 + sizeof(uint32_t);
    }

    case OP_JUMP:
    case OP_JUMP_IF_NOT: {
        return 1 + sizeof(int32_t);
    }

    case OP_LITERAL_STRING: {
        return 1
            + sizeof(size_t)
            + string_length(instr.literal_string.content)
            + 1;
    }

    case OP_LITERAL_SYMBOL: {
        return 1
            + sizeof(size_t)
            + string_length(instr.literal_symbol.content)
            + 1;
    }

    case OP_LITERAL_KEYWORD: {
        return 1
            + sizeof(size_t)
            + string_length(instr.literal_keyword.content)
            + 1;
    }

    default: {
        return 1;
    }
}
}
