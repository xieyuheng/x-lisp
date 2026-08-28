#pragma once

program_t *xvm_asm_load_program(path_t *path, bool profile);

void xvm_asm_declare(program_t *program, value_t sexps);
void xvm_asm_prepare(program_t *program, value_t sexps);
void xvm_asm_assemble(program_t *program, value_t sexps);
void xvm_asm_assemble_function(program_t *program, function_t *function, value_t sexp);
size_t xvm_asm_compute_function_local_count(size_t arity, value_t body);
