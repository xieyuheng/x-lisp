#include "index.h"

mod_t *
load(path_t *path) {
    file_t *file = file_open_or_fail(path_string(path), "r");
    char *string = file_read_string(file);
    list_t *tokens = lex(path, string);
    string_free(string);

    mod_t *mod = make_mod(path);

    vm_t *vm = make_vm(mod, tokens);
    execute(vm);
    vm_free(vm);

    return mod;
}
