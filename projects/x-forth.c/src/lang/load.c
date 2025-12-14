#include "index.h"

extern void import_builtin(mod_t *mod);

mod_t *
load(path_t *path) {
    file_t *file = file_open_or_fail(path_string(path), "r");
    list_t *tokens = lex(path, file_read_string(file));

    mod_t *mod = make_mod(path);
    import_builtin(mod);

    vm_t *vm = make_vm(mod, tokens);
    vm_interpret(vm);
    vm_free(vm);

    return mod;
}
