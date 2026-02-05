#include "index.h"

extern void import_builtin_mod(mod_t *mod);

static record_t *prepared_mods = NULL;
static record_t *mod_bodies = NULL;

static value_t
read_mod_body(path_t *path) {
    if (!mod_bodies) {
        mod_bodies = make_record();
    }

    if (record_has(mod_bodies, path_string(path))) {
        return (value_t) record_get(mod_bodies, path_string(path));
    }

    file_t *file = open_file_or_fail(path_string(path), "r");
    value_t sexps = parse_sexps(path, file_read_string(file));
    record_put(mod_bodies, path_string(path), (void *) sexps);
    return sexps;
}

mod_t *
basic_load(path_t *path) {
    if (!prepared_mods) {
        prepared_mods = make_record();
    }

    if (record_has(prepared_mods, path_string(path))) {
        return record_get(prepared_mods, path_string(path));
    }

    value_t sexps = read_mod_body(path);
    mod_t *mod = make_mod(path);

    import_builtin_mod(mod);
    record_put(prepared_mods, path_string(path), mod);
    basic_prepare(mod, sexps);
    basic_import(mod, sexps);
    return mod;
}

static void
compile_prepared_mods(void) {
    record_iter_t iter;
    record_iter_init(&iter, prepared_mods);
    char *key = record_iter_next_key(&iter);
    while (key) {
        mod_t *mod = record_get(prepared_mods, key);
        value_t sexps = (value_t) record_get(mod_bodies, key);
        basic_compile(mod, sexps);
        basic_setup(mod);

        key = record_iter_next_key(&iter);
    }
}

void
basic_run(mod_t *mod) {
    compile_prepared_mods();
    basic_run_main(mod);
}
