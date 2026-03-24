#pragma once

void basic_prepare(mod_t *mod, value_t sexps);
void basic_compile(mod_t *mod, value_t sexps);
void basic_export(mod_t *mod, value_t sexps);
void basic_import(mod_t *mod, value_t sexps);

mod_t *basic_load(path_t *path);
void basic_compile_loaded_mods(void);
void basic_setup_loaded_mods(void);
void basic_bytecode(const mod_t *mod);
void basic_run(mod_t *mod);
