#include "index.h"

mod_t *
load(path_t *path) {
    mod_t *mod = make_mod(path);
    vm_t *vm = make_vm(mod);
    execute(vm);
    return mod;
}
