#pragma once

void basic_compile(mod_t *mod, value_t sexps);

mod_t *basic_load(path_t *path);
void basic_setup(mod_t *mod);
void basic_run(mod_t *mod);
