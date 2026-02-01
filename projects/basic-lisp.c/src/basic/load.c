#include "index.h"

extern void import_builtin_mod(mod_t *mod);

static record_t *global_prepared_mods = NULL;
static record_t *global_mod_bodies = NULL;

static value_t
read_mod_body(path_t *path) {
    if (!global_mod_bodies) {
        global_mod_bodies = make_record();
    }

    if (record_has(global_mod_bodies, path_string(path))) {
        return (value_t) record_get(global_mod_bodies, path_string(path));
    }

    file_t *file = open_file_or_fail(path_string(path), "r");
    value_t sexps = parse_sexps(path, file_read_string(file));
    record_put(global_mod_bodies, path_string(path), (void *) sexps);
    return sexps;
}

static mod_t *
prepare(path_t *path) {
    if (!global_prepared_mods) {
        global_prepared_mods = make_record();
    }

    if (record_has(global_prepared_mods, path_string(path))) {
        return record_get(global_prepared_mods, path_string(path));
    }

    value_t sexps = read_mod_body(path);
    mod_t *mod = make_mod(path);

    import_builtin_mod(mod);
    load_stage0(mod, sexps);
    record_put(global_prepared_mods, path_string(path), mod);
    load_stage2(mod, sexps);
    return mod;
}

static void
compile_prepared_mods(void) {
    record_iter_t iter;
    record_iter_init(&iter, global_prepared_mods);
    char *key = record_iter_next_key(&iter);
    while (key) {
        mod_t *mod = record_get(global_prepared_mods, key);
        value_t sexps = (value_t) record_get(global_mod_bodies, key);
        load_stage1(mod, sexps);

        key = record_iter_next_key(&iter);
    }
}

mod_t *
load(path_t *path) {
    mod_t *mod = prepare(path);
    compile_prepared_mods();
    load_stage3(mod);
    load_stage4(mod);
    return mod;
}

mod_t *
import_by(mod_t *mod, const char *string) {
    path_t *path = path_copy(mod->path);
    path_join_mut(path, "..");
    path_join_mut(path, string);

    if (pathname_is_directory(path_string(path))) {
        path_join_mut(path, "index.basic");
    }

    if (!string_ends_with(path_top_segment(path), ".basic")) {
        char *segment = path_pop_segment(path);
        path_push_segment(path, string_append(segment, ".basic"));
        string_free(segment);
    }

    return prepare(path);
}
