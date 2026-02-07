#include "index.h"

static void
basic_definition_bytecode(
    const mod_t *mod,
    const definition_t *definition
) {
    if (definition->mod != mod) {
        return;
    }

    switch (definition->kind) {
    case FUNCTION_DEFINITION: {
        string_print("@define-function ");
        string_print(definition->name);
        newline();
        function_inspect(definition->function_definition.function);
        newline();
        return;
    }

    case PRIMITIVE_DEFINITION: {
        return;
    }

    case VARIABLE_DEFINITION: {
        string_print("@define-variable ");
        string_print(definition->name);
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
        definition_t *definition = entry->value;
        basic_definition_bytecode(mod, definition);

        entry = record_iter_next_entry(&iter);
    }
}
