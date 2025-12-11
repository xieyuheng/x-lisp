#include "index.h"

size_t
instr_length(struct instr_t instr) {
    switch (instr.op) {
    case OP_NOP: {
        return 1;
    }

    case OP_LITERAL_INT: {
        return 1 + sizeof(int64_t);
    }

    case OP_IADD:
    case OP_ISUB:
    case OP_IMUL:
    case OP_IDIV:
    case OP_IMOD: {
        return 1;
    }

    case OP_LITERAL_FLOAT: {
        return 1 + sizeof(double);
    }

    case OP_FADD:
    case OP_FSUB:
    case OP_FMUL:
    case OP_FDIV:
    case OP_FMOD: {
        return 1;
    }

    case OP_RETURN: {
        return 1;
    }

    case OP_PRIMITIVE_CALL:
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
    }

    unreachable();
}

void
instr_encode(uint8_t *code, struct instr_t instr) {
    switch (instr.op) {
    case OP_NOP: {
        memory_store_little_endian(code + 0, instr.op);
        return;
    }

    case OP_LITERAL_INT: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.literal_int.content);
        return;
    }

    case OP_IADD:
    case OP_ISUB:
    case OP_IMUL:
    case OP_IDIV:
    case OP_IMOD: {
        memory_store_little_endian(code + 0, instr.op);
        return;
    }

    case OP_LITERAL_FLOAT: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.literal_float.content);
        return;
    }

    case OP_FADD:
    case OP_FSUB:
    case OP_FMUL:
    case OP_FDIV:
    case OP_FMOD: {
        memory_store_little_endian(code + 0, instr.op);
        return;
    }

    case OP_RETURN: {
        memory_store_little_endian(code + 0, instr.op);
        return;
    }

    case OP_PRIMITIVE_CALL: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.primitive_call.definition);
        return;
    }

    case OP_CALL: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.call.definition);
        return;
    }

    case OP_TAIL_CALL: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.tail_call.definition);
        return;
    }

    case OP_CONST_LOAD: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.const_load.definition);
        return;
    }

    case OP_VAR_LOAD: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.var_load.definition);
        return;
    }

    case OP_VAR_STORE: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.var_store.definition);
        return;
    }

    case OP_LOCAL_LOAD: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.local_load.index);
        return;
    }

    case OP_LOCAL_STORE: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.local_store.index);
        return;
    }

    case OP_JUMP: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.jump.offset);
        return;
    }

    case OP_JUMP_IF_NOT: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.jump_if_not.offset);
        return;
    }

    case OP_LITERAL_STRING: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.literal_string.length);
        memory_copy(code + 1 + sizeof instr.literal_string.length,
                    instr.literal_string.content,
                    instr.literal_string.length + 1);
        return;
    }

    case OP_LITERAL_SYMBOL: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.literal_symbol.length);
        memory_copy(code + 1 + sizeof instr.literal_symbol.length,
                    instr.literal_symbol.content,
                    instr.literal_symbol.length + 1);
        return;
    }

    case OP_LITERAL_KEYWORD: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.literal_keyword.length);
        memory_copy(code + 1 + sizeof instr.literal_keyword.length,
                    instr.literal_keyword.content,
                    instr.literal_keyword.length + 1);
        return;
    }
    }

    unreachable();
}

struct instr_t
instr_decode(uint8_t *code) {
    switch (code[0]) {
    case OP_NOP: {
        struct instr_t instr = { .op = code[0] };
        return instr;
    }

    case OP_LITERAL_INT: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.literal_int.content);
        return instr;
    }

    case OP_IADD:
    case OP_ISUB:
    case OP_IMUL:
    case OP_IDIV:
    case OP_IMOD: {
        struct instr_t instr = { .op = code[0] };
        return instr;
    }

    case OP_LITERAL_FLOAT: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.literal_float.content);
        return instr;
    }

    case OP_FADD:
    case OP_FSUB:
    case OP_FMUL:
    case OP_FDIV:
    case OP_FMOD: {
        struct instr_t instr = { .op = code[0] };
        return instr;
    }

    case OP_RETURN: {
        struct instr_t instr = { .op = code[0] };
        return instr;
    }

    case OP_PRIMITIVE_CALL: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.primitive_call.definition);
        return instr;
    }

    case OP_CALL: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.call.definition);
        return instr;
    }

    case OP_TAIL_CALL: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.tail_call.definition);
        return instr;
    }

    case OP_CONST_LOAD: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.const_load.definition);
        return instr;
    }

    case OP_VAR_LOAD: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.var_load.definition);
        return instr;
    }

    case OP_VAR_STORE: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.var_store.definition);
        return instr;
    }

    case OP_LOCAL_LOAD: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.local_load.index);
        return instr;
    }

    case OP_LOCAL_STORE: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.local_store.index);
        return instr;
    }

    case OP_JUMP: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.jump.offset);
        return instr;
    }

    case OP_JUMP_IF_NOT: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.jump_if_not.offset);
        return instr;
    }

    case OP_LITERAL_STRING: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.literal_string.length);
        instr.literal_string.content =
            (char *) code + 1 + sizeof instr.literal_string.length;
        return instr;
    }

    case OP_LITERAL_SYMBOL: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.literal_symbol.length);
        instr.literal_symbol.content =
            (char *) code + 1 + sizeof instr.literal_symbol.length;
        return instr;
    }

    case OP_LITERAL_KEYWORD: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.literal_keyword.length);
        instr.literal_keyword.content =
            (char *) code + 1 + sizeof instr.literal_keyword.length;
        return instr;
    }
    }

    unreachable();
}
