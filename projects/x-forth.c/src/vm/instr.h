#pragma once

// - instruction should be used as a struct value.
// - there should be no value in instruction,
//   so that GC root scaning no need to scan instructions.

struct instr_t {
    op_t op;
    union {
        struct { value_t value; } literal;
        struct { definition_t *definition; } ref;
        struct { uint32_t index; } local;
        struct { int32_t offset; } jump; // offset is based on next instr.
        struct { const token_t *token; } assert;
    };
};

size_t instr_length(struct instr_t instr);
void instr_encode(uint8_t *code, struct instr_t instr);
struct instr_t instr_decode(uint8_t *code);

uint8_t *make_code_from_instrs(size_t length, struct instr_t instrs[]);
