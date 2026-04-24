#pragma once

void stk_prepare(mod_t *mod, value_t sexps);
void stk_compile(mod_t *mod, value_t sexps);
void stk_setup(mod_t *mod);

mod_t *stk_load(path_t *path);

void stk_call(mod_t *mod, const char *name);
void stk_test(mod_t *mod, const char *snapshot);
void stk_builtin_test(mod_t *mod, const char *snapshot);
void stk_test_definition(mod_t *mod, const char *snapshot, definition_t *definition);
