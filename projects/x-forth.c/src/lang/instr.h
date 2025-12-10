#pragma once

// - instruction should be used as a struct value.
// - there should be no value in instruction,
//   so that GC root scaning no need to scan instructions.

struct instr_t {
    op_t op;
    union {
        struct { int64_t content; } literal_int;
        struct { double content; } literal_float;
        struct { definition_t *definition; } call;
        struct { definition_t *definition; } tail_call;
        struct { definition_t *definition; } const_load;
        struct { definition_t *definition; } var_load;
        struct { definition_t *definition; } var_store;
        struct { uint32_t index; } local_load;
        struct { uint32_t index; } local_store;
        struct { int32_t offset; } jump;
        struct { int32_t offset; } jump_if_not;
        struct { size_t length; char *content; } literal_string;
        struct { size_t length; char *content; } literal_symbol;
        struct { size_t length; char *content; } literal_keyword;
    };
};

size_t instr_length(struct instr_t instr);
