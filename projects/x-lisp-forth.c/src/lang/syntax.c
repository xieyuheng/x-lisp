#include "index.h"

static void
syntax_var(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    function_t *function = make_function();
    define_variable_setup(vm_mod(vm), token->content, function);
    compile_function(vm, function);
    token_free(token);
}

static void
syntax_def(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    function_t *function = make_function();
    define_function(vm_mod(vm), token->content, function);
    compile_function(vm, function);
    token_free(token);
}

static void
syntax_export(vm_t *vm) {
    while (true) {
        if (vm_no_more_tokens(vm)) {
            who_printf("missing @end\n");
            exit(1);
        }

        token_t *token = vm_next_token(vm);
        if (string_equal(token->content, "@end")) {
            token_free(token);
            return;
        } else {
            assert(token->kind == SYMBOL_TOKEN);
            mod_t *mod = vm_mod(vm);
            set_add(mod->exported_names, token->content);
            token_free(token);
        }
    }
}

static void
syntax_import(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == STRING_TOKEN);
    mod_t *imported_mod = mod_load_by(vm_mod(vm), token->content);
    token_free(token);

    while (true) {
        if (vm_no_more_tokens(vm)) {
            who_printf("missing @end\n");
            exit(1);
        }

        token_t *token = vm_next_token(vm);
        if (string_equal(token->content, "@end")) {
            token_free(token);
            return;
        } else {
            assert(token->kind == SYMBOL_TOKEN);
            mod_t *mod = vm_mod(vm);
            char *name = string_copy(token->content);
            import_entry_t *import_entry = make_import_entry(imported_mod, name);
            array_push(mod->import_entries, import_entry);
            token_free(token);
        }
    }
}

static void
syntax_include(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == STRING_TOKEN);
    mod_t *imported_mod = mod_load_by(vm_mod(vm), token->content);
    token_free(token);

    while (true) {
        if (vm_no_more_tokens(vm)) {
            who_printf("missing @end\n");
            exit(1);
        }

        token_t *token = vm_next_token(vm);
        if (string_equal(token->content, "@end")) {
            token_free(token);
            return;
        } else {
            assert(token->kind == SYMBOL_TOKEN);
            mod_t *mod = vm_mod(vm);
            char *name = string_copy(token->content);
            import_entry_t *import_entry = make_import_entry(imported_mod, name);
            import_entry->is_exported = true;
            array_push(mod->import_entries, import_entry);
            token_free(token);
        }
    }
}

static void
syntax_import_all(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == STRING_TOKEN);
    mod_t *imported_mod = mod_load_by(vm_mod(vm), token->content);
    token_free(token);

    mod_t *mod = vm_mod(vm);
    record_iter_t iter;
    record_iter_init(&iter, imported_mod->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (definition->mod == imported_mod) {
            char *name = string_copy(definition->name);
            import_entry_t *import_entry = make_import_entry(imported_mod, name);
            array_push(mod->import_entries, import_entry);
        }

        definition = record_iter_next_value(&iter);
    }
}

static void
syntax_include_all(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == STRING_TOKEN);
    mod_t *imported_mod = mod_load_by(vm_mod(vm), token->content);
    token_free(token);

    mod_t *mod = vm_mod(vm);
    record_iter_t iter;
    record_iter_init(&iter, imported_mod->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (definition->mod == imported_mod) {
            char *name = string_copy(definition->name);
            import_entry_t *import_entry = make_import_entry(imported_mod, name);
            import_entry->is_exported = true;
            array_push(mod->import_entries, import_entry);
        }

        definition = record_iter_next_value(&iter);
    }
}

struct syntax_entry_t { const char *name; x_fn_t *handler; };

static struct syntax_entry_t syntax_entries[] = {
    { "@var", syntax_var },
    { "@def", syntax_def },
    { "@export", syntax_export },
    { "@import", syntax_import },
    { "@include", syntax_include },
    { "@import-all", syntax_import_all },
    { "@include-all", syntax_include_all },
};

static size_t
get_syntax_entry_count(void) {
    return sizeof syntax_entries / sizeof(struct syntax_entry_t);
}

x_fn_t *
syntax_find_handler(const char *name) {
    for (size_t i = 0; i < get_syntax_entry_count(); i++) {
        struct syntax_entry_t syntax_entry = syntax_entries[i];
        if (string_equal(syntax_entry.name, name)) {
            return syntax_entry.handler;
        }
    }

    return NULL;
}
