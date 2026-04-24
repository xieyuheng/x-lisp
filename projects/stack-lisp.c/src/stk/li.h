#pragma once

mod_t *stk_load(path_t *path);

void stk_execute(mod_t *mod, line_t *line);
void stk_execute_fn(mod_t *mod, line_t *line);
void stk_execute_put(mod_t *mod, line_t *line);

void stk_call(mod_t *mod, const char *name);
void stk_test(mod_t *mod, const char *snapshot);
void stk_test_definition(mod_t *mod, const char *snapshot, definition_t *definition);
void stk_builtin_test(mod_t *mod, const char *snapshot);
