#pragma once

mod_t *load(path_t *path);
void load_stage1(vm_t *vm);
void load_stage2(vm_t *vm);
void load_stage3(vm_t *vm);
