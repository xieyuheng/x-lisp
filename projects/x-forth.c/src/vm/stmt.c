#include "index.h"

static void
handle_define_variable(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    function_t *function = make_function();
    define_variable_setup(vm_mod(vm), token->content, function);
    compile_function(vm, function);
    token_free(token);
}

static void
handle_define_function(vm_t *vm) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    function_t *function = make_function();
    define_function(vm_mod(vm), token->content, function);
    compile_function(vm, function);
    token_free(token);
}

static void
handle_export(vm_t *vm) {
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
            set_add(mod->exported_names, string_copy(token->content));
            token_free(token);
        }
    }
}

static void
import(vm_t *vm, bool is_exported) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == STRING_TOKEN);
    mod_t *imported_mod = import_by(vm_mod(vm), token->content);
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
            import_entry->is_exported = is_exported;
            array_push(mod->import_entries, import_entry);
            token_free(token);
        }
    }
}

static void handle_import(vm_t *vm) { import(vm, false); }
static void handle_include(vm_t *vm) { import(vm, true); }

static void
import_all(vm_t *vm, bool is_exported) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == STRING_TOKEN);
    mod_t *imported_mod = import_by(vm_mod(vm), token->content);
    token_free(token);

    mod_t *mod = vm_mod(vm);
    record_iter_t iter;
    record_iter_init(&iter, imported_mod->definitions);
    char *key = record_iter_next_key(&iter);
    while (key) {
        if (set_member(imported_mod->exported_names, key)) {
            char *name = string_copy(key);
            import_entry_t *import_entry = make_import_entry(imported_mod, name);
            import_entry->is_exported = is_exported;
            array_push(mod->import_entries, import_entry);
        }

        key = record_iter_next_key(&iter);
    }
}

static void handle_import_all(vm_t *vm) { import_all(vm, false); }
static void handle_include_all(vm_t *vm) { import_all(vm, true); }

static void
import_except(vm_t *vm, bool is_exported) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == STRING_TOKEN);
    mod_t *imported_mod = import_by(vm_mod(vm), token->content);
    token_free(token);

    set_t *excepted_names = make_string_set();
    while (true) {
        if (vm_no_more_tokens(vm)) {
            who_printf("missing @end\n");
            exit(1);
        }

        token_t *token = vm_next_token(vm);
        if (string_equal(token->content, "@end")) {
            token_free(token);
            break;
        } else {
            assert(token->kind == SYMBOL_TOKEN);
            set_add(excepted_names, string_copy(token->content));
            token_free(token);
        }
    }

    mod_t *mod = vm_mod(vm);
    record_iter_t iter;
    record_iter_init(&iter, imported_mod->definitions);
    char *key = record_iter_next_key(&iter);
    while (key) {
        if (set_member(imported_mod->exported_names, key)
            && !set_member(excepted_names, key)) {
            char *name = string_copy(key);
            import_entry_t *import_entry =
                make_import_entry(imported_mod, name);
            import_entry->is_exported = is_exported;
            array_push(mod->import_entries, import_entry);
        }

        key = record_iter_next_key(&iter);
    }

    set_free(excepted_names);
}

static void handle_import_except(vm_t *vm) { import_except(vm, false); }
static void handle_include_except(vm_t *vm) { import_except(vm, true); }

static void
import_as(vm_t *vm, bool is_exported) {
    token_t *token = vm_next_token(vm);
    assert(token->kind == STRING_TOKEN);
    mod_t *imported_mod = import_by(vm_mod(vm), token->content);
    token_free(token);

    token = vm_next_token(vm);
    assert(token->kind == SYMBOL_TOKEN);
    char *prefix = string_copy(token->content);
    token_free(token);

    mod_t *mod = vm_mod(vm);
    record_iter_t iter;
    record_iter_init(&iter, imported_mod->definitions);
    char *key = record_iter_next_key(&iter);
    while (key) {
        if (set_member(imported_mod->exported_names, key)) {
            char *name = string_copy(key);
            char *rename = string_append(prefix, key);
            import_entry_t *import_entry = make_import_entry(imported_mod, name);
            import_entry->rename = rename;
            import_entry->is_exported = is_exported;
            array_push(mod->import_entries, import_entry);
        }

        key = record_iter_next_key(&iter);
    }

    string_free(prefix);
}

static void handle_import_as(vm_t *vm) { import_as(vm, false); }
static void handle_include_as(vm_t *vm) { import_as(vm, true); }

struct stmt_entry_t { const char *name; x_fn_t *handler; };

static struct stmt_entry_t stmt_entries[] = {
    { "@define-variable", handle_define_variable },
    { "@define-function", handle_define_function },
    { "@export", handle_export },
    { "@import", handle_import },
    { "@include", handle_include },
    { "@import-all", handle_import_all },
    { "@include-all", handle_include_all },
    { "@import-except", handle_import_except },
    { "@include-except", handle_include_except },
    { "@import-as", handle_import_as },
    { "@include-as", handle_include_as },
};

static size_t
get_stmt_entry_count(void) {
    return sizeof stmt_entries / sizeof(struct stmt_entry_t);
}

x_fn_t *
find_stmt_handler(const char *name) {
    for (size_t i = 0; i < get_stmt_entry_count(); i++) {
        struct stmt_entry_t stmt_entry = stmt_entries[i];
        if (string_equal(stmt_entry.name, name)) {
            return stmt_entry.handler;
        }
    }

    return NULL;
}
