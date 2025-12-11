#include "index.h"

static void compile_return(vm_t *vm, definition_t *definition);
static void compile_token(vm_t *vm, definition_t *definition, token_t *token);
static void compile_referred(vm_t *vm, definition_t *definition, definition_t *referred);
// static void compile_tail_call(vm_t *vm, definition_t *definition);

void
compile_function(vm_t *vm, definition_t *definition) {
    assert(definition->kind == FUNCTION_DEFINITION);
    while (true) {
        if (list_is_empty(vm->tokens)) {
            who_printf("missing @end");
            assert(false);
        }

        token_t *token = list_shift(vm->tokens);
        if (token->kind == SYMBOL_TOKEN && string_equal(token->content, "@end")) {
            compile_return(vm, definition);
            token_free(token);
            return;
        } else {
            compile_token(vm, definition, token);
            token_free(token);
        }
    }
}

static void
compile_return(vm_t *vm, definition_t *definition) {
    (void) vm;
    struct instr_t instr = { .op = OP_RETURN };
    function_definition_append_instr(definition, instr);
}

static void
compile_token(vm_t *vm, definition_t *definition, token_t *token) {
    switch (token->kind) {
    case SYMBOL_TOKEN: {
        if (string_equal(token->content, "@return")) {
            compile_return(vm, definition);
            return;
        // } else if (string_equal(token->content, "@tail-call")) {
        //     compile_tail_call(vm, definition);
        //     return;
        } else {
            definition_t *referred = mod_lookup(vm->mod, token->content);
            assert(referred);
            compile_referred(vm, definition, referred);
            return;
        }
    }

    case STRING_TOKEN: {
        TODO();
        return;
    }

    case INT_TOKEN: {
        struct instr_t instr = {
            .op = OP_LITERAL_INT,
            .literal_int.content = string_parse_int(token->content),
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    case FLOAT_TOKEN: {
        struct instr_t instr = {
            .op = OP_LITERAL_FLOAT,
            .literal_float.content = string_parse_double(token->content),
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    case BRACKET_START_TOKEN: {
        TODO();
        return;
    }

    case BRACKET_END_TOKEN: {
        TODO();
        return;
    }

    case QUOTATION_MARK_TOKEN: {
        TODO();
        return;
    }

    case KEYWORD_TOKEN: {
        TODO();
        return;
    }

    case HASHTAG_TOKEN: {
        TODO();
        return;
    }

    case LINE_COMMENT_TOKEN: {
        return;
    }
    }
}

static void
compile_referred(vm_t *vm, definition_t *definition, definition_t *referred) {
    (void) vm;
    switch (referred->kind) {
    case FUNCTION_DEFINITION: {
        struct instr_t instr = {
            .op = OP_CALL,
            .call.definition = referred,
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    case PRIMITIVE_DEFINITION: {
        struct instr_t instr = {
            .op = OP_PRIMITIVE_CALL,
            .primitive_call.definition = referred,
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    case VARIABLE_DEFINITION: {
        struct instr_t instr = {
            .op = OP_VAR_LOAD,
            .var_load.definition = referred,
        };
        function_definition_append_instr(definition, instr);
        return;
    }

    case CONSTANT_DEFINITION: {
        struct instr_t instr = {
            .op = OP_CONST_LOAD,
            .const_load.definition = referred,
        };
        function_definition_append_instr(definition, instr);
        return;
    }
    }
}
