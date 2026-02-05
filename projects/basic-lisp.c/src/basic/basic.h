#pragma once

void basic_prepare(mod_t *mod, value_t sexps); // install names
void basic_compile(mod_t *mod, value_t sexps); // compile
void basic_import(mod_t *mod, value_t sexps); // import
void basic_setup(mod_t *mod); // setup variables
void basic_run_main(mod_t *mod); // run main

mod_t *prepare(path_t *path);
mod_t *load(path_t *path);
