#pragma once

// - instruction should be used as a struct value.
// - there should be no compound value in instruction,
//   so that GC root scaning no need to scan instructions.

// struct instr_t {
//     op_t op;
//     union {
//         // struct { value_t value; } literal;
//         // struct { definition_t *definition; } ref;
//         // struct { definition_t *definition; } call;
//         // struct { definition_t *definition; } tail_call;
//         // struct { uint32_t index; } local_load;
//         // struct { uint32_t index; } local_store;
//         // struct { int32_t offset; } jump; // offset is based on next instr.
//         // struct { int32_t offset; } jump_if_not;
//         // struct { const token_t *token; } assert;
//         // struct { const token_t *token; } assert_equal;
//         // struct { const token_t *token; } assert_not_equal;
//     };
// };

// typedef enum {
//     // OP_NOP,
//     // OP_LITERAL,
//     // OP_IADD,
//     // OP_ISUB,
//     // OP_IMUL,
//     // OP_IDIV,
//     // OP_IMOD,
//     // OP_FADD,
//     // OP_FSUB,
//     // OP_FMUL,
//     // OP_FDIV,
//     // OP_FMOD,
//     // OP_RETURN,
//     // OP_CALL,
//     // OP_TAIL_CALL,
//     // OP_REF,
//     // OP_APPLY,
//     // OP_TAIL_APPLY,
//     // OP_ASSIGN,
//     // OP_LOCAL_LOAD,
//     // OP_LOCAL_STORE,
//     // OP_JUMP,
//     // OP_JUMP_IF_NOT,
//     // OP_DUP,
//     // OP_DROP,
//     // OP_SWAP,
//     // OP_ASSERT,
//     // OP_ASSERT_EQUAL,
//     // OP_ASSERT_NOT_EQUAL,
// } op_t;

// size_t instr_length(struct instr_t instr);
// void instr_encode(uint8_t *code, struct instr_t instr);
// struct instr_t instr_decode(uint8_t *code);
