#pragma once

// - instruction should be used as a struct value.
// - there should be no compound value in instruction,
//   so that GC root scaning no need to scan instructions.

typedef enum {
    OP_LITERAL,
    OP_RETURN,
    OP_CALL,
    OP_TAIL_CALL,
    OP_REF,
    OP_GLOBAL_LOAD,
    OP_GLOBAL_STORE,
    OP_APPLY,
    OP_TAIL_APPLY,
    OP_ASSIGN_VARIABLE,
    OP_LOCAL_LOAD,
    OP_LOCAL_STORE,
    OP_JUMP,
    OP_JUMP_IF_NOT,
    OP_DROP,
} op_t;

struct instr_t {
    op_t op;
    union {
        struct { value_t value; } literal;
        struct { definition_t *definition; } ref;
        struct { uint32_t index; } local;
        struct { int32_t offset; } jump; // offset is based on next instr.
    };
};

size_t instr_length(struct instr_t instr);
void instr_encode(uint8_t *code, struct instr_t instr);
struct instr_t instr_decode(uint8_t *code);

uint8_t *make_code_from_instrs(size_t length, struct instr_t instrs[]);
