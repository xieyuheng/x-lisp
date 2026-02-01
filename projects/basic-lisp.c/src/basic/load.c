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

    file_t *file = open_file_or_fail(path_string(path), "r");
    value_t sexps = parse_sexps(path, file_read_string(file));

    mod_t *mod = make_mod(path);
    record_put(global_loaded_mods, path_string(path), mod);
    import_builtin_mod(mod);

    load_stage2(mod, sexps);
    load_stage1(mod, sexps);

    load_stage3(mod);

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

    return load(path);
}
