#pragma once

mod_t *xasm_load_mod(path_t *path, bool profile);

void xasm_declare(mod_t *mod, value_t sexps);
void xasm_prepare(mod_t *mod, value_t sexps);
void xasm_assemble(mod_t *mod, value_t sexps);
void xasm_assemble_function(mod_t *mod, function_t *function, value_t sexp);
size_t compute_function_local_count(size_t arity, value_t body);
