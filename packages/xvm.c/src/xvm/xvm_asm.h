#pragma once

mod_t *xvm_asm_load_mod(path_t *path, bool profile);

void xvm_asm_declare(mod_t *mod, value_t sexps);
void xvm_asm_prepare(mod_t *mod, value_t sexps);
void xvm_asm_assemble(mod_t *mod, value_t sexps);
void xvm_asm_assemble_function(mod_t *mod, function_t *function, value_t sexp);
size_t xvm_asm_compute_function_local_count(size_t arity, value_t body);
