#include "index.h"

extern void import_builtin(mod_t *mod);

static void stage1(vm_t *vm);
static void stage2(vm_t *vm);
static void stage3(vm_t *vm);

mod_t *
load(path_t *path) {
    file_t *file = file_open_or_fail(path_string(path), "r");
    list_t *tokens = lex(path, file_read_string(file));

    mod_t *mod = make_mod(path);
    import_builtin(mod);

    vm_t *vm = make_vm(mod, tokens);
    stage1(vm);
    stage2(vm);
    stage3(vm);
    vm_free(vm);

    return mod;
}

static void
interpret_token(vm_t *vm, token_t *token) {
    switch (token->kind) {
    case LINE_COMMENT_TOKEN: {
        token_free(token);
        return;
    }

    case SYMBOL_TOKEN: {
        if (string_equal(token->content, "@var")) {
            syntax_var(vm);
            token_free(token);
            return;
        }

        if (string_equal(token->content, "@def")) {
            syntax_def(vm);
            token_free(token);
            return;
        }

        who_printf("unknown top-level symbol: %s\n", token->content);
        token_free(token);
        return;
    }

    default: {
        who_printf("unhandled top-level token: %s\n", token->content);
        return;
    }
    }
}

static void
stage1(vm_t *vm) {
    while (!vm_no_more_tokens(vm)) {
        token_t *token = vm_next_token(vm);
        interpret_token(vm, token);
    }
}

static void
setup_variable(vm_t *vm, definition_t *definition) {
    assert(definition->kind == VARIABLE_DEFINITION);
    if (definition->variable_definition.function) {
        uint8_t *code = definition->variable_definition.function->code_area;
        vm_push_frame(vm, make_frame_from_code(code));
        vm_execute(vm);
    }
}

static void
stage2(vm_t *vm) {
    record_iter_t iter;
    record_iter_init(&iter, vm_mod(vm)->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (definition->kind == VARIABLE_DEFINITION) {
            setup_variable(vm, definition);
        }

        definition = record_iter_next_value(&iter);
    }
}

static void
prepare_tail_call(vm_t *vm, const char *name) {
    definition_t *definition = mod_lookup(vm_mod(vm), name);
    assert(definition);
    uint8_t *code = make_code_from_instrs(1, (struct instr_t[]) {
            { .op = OP_TAIL_CALL,
              .tail_call.definition = definition },
        });
    vm_push_frame(vm, make_frame_from_code(code));
}

static void
stage3(vm_t *vm) {
    prepare_tail_call(vm, "main");
    vm_execute(vm);
}
