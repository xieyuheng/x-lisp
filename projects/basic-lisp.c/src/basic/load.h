#pragma once

mod_t *load(path_t *path);
mod_t *import_by(mod_t *mod, const char *string);

void load_stage0(mod_t *mod, value_t sexps);
void load_stage1(mod_t *mod, value_t sexps);
void load_stage2(mod_t *mod, value_t sexps);
void load_stage3(mod_t *mod);
