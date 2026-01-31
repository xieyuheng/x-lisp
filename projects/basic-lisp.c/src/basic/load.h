#pragma once

mod_t *load(path_t *path);
mod_t *import_by(mod_t *self, const char *string);

// void load_stage1(vm_t *vm);
// void load_stage2(vm_t *vm);
// void load_stage3(vm_t *vm);
