#include "index.h"

size_t
instr_length(struct instr_t instr) {
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

    case OP_APPLY:
    case OP_TAIL_APPLY:
    case OP_ASSIGN_VARIABLE: {
        return 1;
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

void
instr_encode(uint8_t *code, struct instr_t instr) {
    switch (instr.op) {
    case OP_LITERAL: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.literal.value);
        return;
    }

    case OP_RETURN: {
        memory_store_little_endian(code + 0, instr.op);
        return;
    }

    case OP_CALL: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.ref.definition);
        return;
    }

    case OP_TAIL_CALL: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.ref.definition);
        return;
    }

    case OP_REF: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.ref.definition);
        return;
    }

    case OP_APPLY:
    case OP_TAIL_APPLY:
    case OP_ASSIGN_VARIABLE: {
        memory_store_little_endian(code + 0, instr.op);
        return;
    }

    case OP_LOCAL_LOAD: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.local.index);
        return;
    }

    case OP_LOCAL_STORE: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.local.index);
        return;
    }

    case OP_JUMP: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.jump.offset);
        return;
    }

    case OP_JUMP_IF_NOT: {
        memory_store_little_endian(code + 0, instr.op);
        memory_store_little_endian(code + 1, instr.jump.offset);
        return;
    }

    case OP_DROP: {
        memory_store_little_endian(code + 0, instr.op);
        return;
    }
    }

    unreachable();
}

struct instr_t
instr_decode(uint8_t *code) {
    switch (code[0]) {
    case OP_LITERAL: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.literal.value);
        return instr;
    }

    case OP_RETURN: {
        struct instr_t instr = { .op = code[0] };
        return instr;
    }

    case OP_CALL: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.ref.definition);
        return instr;
    }

    case OP_TAIL_CALL: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.ref.definition);
        return instr;
    }

    case OP_REF: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.ref.definition);
        return instr;
    }

    case OP_APPLY:
    case OP_TAIL_APPLY:
    case OP_ASSIGN_VARIABLE: {
        struct instr_t instr = { .op = code[0] };
        return instr;
    }

    case OP_LOCAL_LOAD: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.local.index);
        return instr;
    }

    case OP_LOCAL_STORE: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.local.index);
        return instr;
    }

    case OP_JUMP: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.jump.offset);
        return instr;
    }

    case OP_JUMP_IF_NOT: {
        struct instr_t instr = { .op = code[0] };
        memory_load_little_endian(code + 1, instr.jump.offset);
        return instr;
    }

    case OP_DROP: {
        struct instr_t instr = { .op = code[0] };
        return instr;
    }
    }

    unreachable();
}

uint8_t *
make_code_from_instrs(size_t length, struct instr_t instrs[]) {
    size_t size = 0;
    for (size_t i = 0; i < length; i++) {
        size += instr_length(instrs[i]);
    }

    uint8_t *code = allocate(size);
    uint8_t *pc = code;
    for (size_t i = 0; i < length; i++) {
        instr_encode(pc, instrs[i]);
        pc += instr_length(instrs[i]);
    }

    return code;
}

void
instr_print(struct instr_t instr) {
    switch (instr.op) {
    case OP_LITERAL: {
        printf("LITERAL ");
        print(instr.literal.value);
        return;
    }

    case OP_RETURN: {
        printf("RETURN");
        return;
    }

    case OP_CALL: {
        printf("CALL ");
        string_print(instr.ref.definition->name);
        return;
    }

    case OP_TAIL_CALL: {
        printf("TAIL-CALL ");
        string_print(instr.ref.definition->name);
        return;
    }

    case OP_REF: {
        printf("REF ");
        string_print(instr.ref.definition->name);
        return;
    }

    case OP_APPLY: {
        printf("APPLY");
        return;
    }

    case OP_TAIL_APPLY: {
        printf("TAIL-APPLY");
        return;
    }

    case OP_ASSIGN_VARIABLE: {
        printf("ASSIGN-VARIABLE");
        return;
    }

    case OP_LOCAL_LOAD: {
        printf("LOCAL-LOAD ");
        uint_print(instr.local.index);
        return;
    }

    case OP_LOCAL_STORE: {
        printf("LOCAL-STORE ");
        uint_print(instr.local.index);
        return;
    }

    case OP_JUMP: {
        printf("JUMP ");
        int_print(instr.jump.offset);
        return;
    }

    case OP_JUMP_IF_NOT: {
        printf("JUMP-IF-NOT ");
        int_print(instr.jump.offset);
        return;
    }

    case OP_DROP: {
        printf("DROP");
        return;
    }
    }

    unreachable();
}
