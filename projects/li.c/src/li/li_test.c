#include "index.h"

void
li_test(mod_t *mod, const char *snapshot) {
    record_iter_t iter;
    record_iter_init(&iter, mod->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (db_has_attribute(mod->db, definition->name, "is-test")) {
            assert(definition->kind == FUNCTION_DEFINITION);
            printf("[test] %s\n", definition->name);
            if (snapshot == NULL) {
                li_run(mod, definition->name);
            } else {
                path_t *path = make_path(snapshot);
                path_join(path, "modules");
                path_join(path, definition->name);
                fs_ensure_file(path_raw_string(path));
                stdout_push(path_raw_string(path));

                li_run(mod, definition->name);

                stdout_drop();
                path_free(path);
            }

        }

        definition = record_iter_next_value(&iter);
    }
}
