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

struct syntax_entry_t { const char *name; x_fn_t *handler; };

static struct syntax_entry_t syntax_entries[] = {
    { "@var", syntax_var },
    { "@def", syntax_def },
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
