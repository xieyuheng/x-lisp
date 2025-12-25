#include "index.h"

extern void import_builtin(mod_t *mod);

static void interpret(vm_t *vm);
static void run(vm_t *vm);

mod_t *
load(path_t *path) {
    file_t *file = file_open_or_fail(path_string(path), "r");
    list_t *tokens = lex(path, file_read_string(file));

    mod_t *mod = make_mod(path);
    import_builtin(mod);

    vm_t *vm = make_vm(mod, tokens);
    interpret(vm);
    run(vm);
    vm_free(vm);

    return mod;
}

static void
interpret_token(vm_t *vm, token_t *token) {
    switch (token->kind) {
    case LINE_COMMENT_TOKEN: {
        return;
    }

    case SYMBOL_TOKEN: {
        definition_t *definition = mod_lookup(vm_mod(vm), token->content);
        assert(definition);
        assert(definition->kind == PRIMITIVE_DEFINITION);
        call_primitive(vm, definition->primitive_definition.primitive);
        return;
    }

    default: {
        who_printf("unknown top-level token: %s\n", token->content);
        return;
    }
    }
}

static void
interpret(vm_t *vm) {
    while (!vm_no_more_tokens(vm)) {
        token_t *token = vm_next_token(vm);
        interpret_token(vm, token);
        token_free(token);
        vm_perform_gc(vm);
    }
}

static void
prepare_to_exit(vm_t *vm) {
    definition_t *definition = mod_lookup(vm_mod(vm), "exit");
    assert(definition);

    uint8_t *code = make_code_from_instrs(1, (struct instr_t[]) {
            { .op = OP_TAIL_CALL,
              .tail_call.definition = definition },
        });
    vm_push_frame(vm, make_frame_from_code(code));
}

static void
prepare_main(vm_t *vm) {
    definition_t *definition = mod_lookup(vm_mod(vm), "main");
    if (!definition) return;

    uint8_t *code = make_code_from_instrs(1, (struct instr_t[]) {
            { .op = OP_TAIL_CALL,
              .tail_call.definition = definition },
        });
    vm_push_frame(vm, make_frame_from_code(code));
}

static void
run(vm_t *vm) {
    prepare_to_exit(vm);
    prepare_main(vm);
    vm_execute(vm);
}
