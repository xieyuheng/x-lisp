#include "index.h"

void
define_constant(mod_t *mod, const char *name, value_t *value) {
    hash_insert_or_fail(
        mod->definitions,
        string_copy(name),
        make_constant_definition(mod, string_copy(name), value));
}

void
define_variable(mod_t *mod, const char *name, value_t *value) {
    hash_insert_or_fail(
        mod->definitions,
        string_copy(name),
        make_variable_definition(mod, string_copy(name), value));
}
