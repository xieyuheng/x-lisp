#pragma once

mod_t *li_load(path_t *path);

void li_execute(mod_t *mod, line_t *line);
void li_execute_ins(mod_t *mod, line_t *line);
void li_execute_put(mod_t *mod, line_t *line);

void li_run(mod_t *mod, const char *name);
void li_test(mod_t *mod);

void li_print_bytecode(const mod_t *mod);
