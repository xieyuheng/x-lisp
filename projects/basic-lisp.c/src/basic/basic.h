#pragma once

void basic_prepare(mod_t *mod, value_t sexps);
void basic_compile(mod_t *mod, value_t sexps);
void basic_import(mod_t *mod, value_t sexps);
void basic_run(mod_t *mod);
mod_t *basic_load(path_t *path);
