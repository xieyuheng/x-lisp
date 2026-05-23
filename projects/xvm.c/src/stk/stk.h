#pragma once

mod_t *stk_load(path_t *path, bool profile);

void stk_declare(mod_t *mod, value_t sexps);
void stk_prepare(mod_t *mod, value_t sexps);
void stk_compile(mod_t *mod, value_t sexps);
void stk_setup(mod_t *mod);

void stk_compile_function(mod_t *mod, function_t *function, value_t sexp);

void stk_call(mod_t *mod, const char *name, const array_t *args);
void stk_test(mod_t *mod, const char *snapshot, bool profile);
void stk_builtin_test(mod_t *mod, const char *snapshot, bool profile);
void stk_test_definition(mod_t *mod, const char *snapshot, bool profile, definition_t *definition);
