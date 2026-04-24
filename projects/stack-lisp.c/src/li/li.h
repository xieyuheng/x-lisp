#pragma once

mod_t *li_load(path_t *path);

void li_execute(mod_t *mod, line_t *line);
void li_execute_fn(mod_t *mod, line_t *line);
void li_execute_put(mod_t *mod, line_t *line);

void li_call(mod_t *mod, const char *name);
void li_test(mod_t *mod, const char *snapshot);
void li_test_definition(mod_t *mod, const char *snapshot, definition_t *definition);
void li_builtin_test(mod_t *mod, const char *snapshot);
