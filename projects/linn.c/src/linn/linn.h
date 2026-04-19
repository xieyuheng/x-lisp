#pragma once

mod_t *linn_load(path_t *path);
void linn_execute(mod_t *mod, line_t *line);
void linn_execute_ins(mod_t *mod, line_t *line);
void linn_execute_put(mod_t *mod, line_t *line);
