#pragma once

mod_t *xasm_load(path_t *path, bool profile);

void xasm_declare(mod_t *mod, value_t sexps);
void xasm_prepare(mod_t *mod, value_t sexps);
void xasm_compile(mod_t *mod, value_t sexps);
void xasm_setup(mod_t *mod);

void xasm_compile_function(mod_t *mod, function_t *function, value_t sexp);

void xasm_call(mod_t *mod, const char *name, const array_t *args);
void xasm_test(mod_t *mod, const char *snapshot, bool profile);
void xasm_builtin_test(mod_t *mod, const char *snapshot, bool profile);
void xasm_test_definition(mod_t *mod, const char *snapshot, bool profile, definition_t *definition);
