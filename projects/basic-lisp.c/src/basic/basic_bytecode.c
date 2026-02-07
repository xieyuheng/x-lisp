#include "index.h"

static void
mod_inspect_definition(
    const mod_t *mod,
    const char *name,
    const definition_t *definition
) {
    if (definition->mod != mod) {
        return;
    }

    switch (definition->kind) {
    case FUNCTION_DEFINITION: {
        string_print(name);
        if (!string_equal(name, definition->name)) {
            string_print(" (");
            string_print(definition->name);
            string_print(")");
        }
        newline();

        function_inspect(definition->function_definition.function);
        newline();
        return;
    }

    case PRIMITIVE_DEFINITION: {
        return;
    }

    case VARIABLE_DEFINITION: {
        string_print(name);
        if (!string_equal(name, definition->name)) {
            string_print(" (");
            string_print(definition->name);
            string_print(")");
        }

        string_print(" = ");
        print(definition->variable_definition.value);
        newline();

        if (definition->variable_definition.function) {
            function_inspect(definition->variable_definition.function);
        }

        newline();
        return;
    }
    }

    unreachable();
}

void
basic_bytecode(const mod_t *mod) {
    record_iter_t iter;
    record_iter_init(&iter, mod->definitions);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        char *name = entry->key;
        definition_t *definition = entry->value;
        mod_inspect_definition(mod, name, definition);

        entry = record_iter_next_entry(&iter);
    }
}
