#include "index.h"

void
li_test(mod_t *mod) {
    record_iter_t iter;
    record_iter_init(&iter, mod->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (db_has_attribute(mod->db, definition->name, "is-test")) {
            assert(definition->kind == FUNCTION_DEFINITION);
            printf("[test] %s\n", definition->name);
            li_run(mod, definition->name);
        }

        definition = record_iter_next_value(&iter);
    }
}
