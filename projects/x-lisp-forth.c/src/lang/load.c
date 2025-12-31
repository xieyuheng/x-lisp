#include "index.h"

extern void import_builtin_mod(mod_t *mod);

static record_t *global_loaded_mods = NULL;

mod_t *
load(path_t *path) {
    if (!global_loaded_mods) {
        global_loaded_mods = make_record();
    }

    if (record_has(global_loaded_mods, path_string(path))) {
        return record_get(global_loaded_mods, path_string(path));
    }

    file_t *file = file_open_or_fail(path_string(path), "r");
    list_t *tokens = lex(path, file_read_string(file));

    mod_t *mod = make_mod(path);
    import_builtin_mod(mod);

    record_put(global_loaded_mods, path_string(path), mod);

    vm_t *vm = make_vm(mod, tokens);
    load_stage1(vm);
    load_stage2(vm);
    load_stage3(vm);
    vm_free(vm);

    return mod;
}
