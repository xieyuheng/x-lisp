#include "index.h"

static void
invoke(vm_t *vm, definition_t *definition) {
    switch (definition->kind) {
    case FUNCTION_DEFINITION: {
        size_t base_length = stack_length(vm->frame_stack);
        stack_push(vm->frame_stack, make_frame(definition));
        vm_execute_until(vm, base_length);
        break;
    }

    case PRIMITIVE_DEFINITION: {
        call_primitive(vm, definition->primitive_definition.primitive);
        break;
    }

    case VARIABLE_DEFINITION: {
        stack_push(vm->value_stack, definition->variable_definition.value);
        break;
    }

    case CONSTANT_DEFINITION: {
        stack_push(vm->value_stack, definition->variable_definition.value);
        break;
    }
    }
}

void
interpret_token(vm_t *vm, token_t *token) {
    switch (token->kind) {
    case SYMBOL_TOKEN: {
        definition_t *definition = mod_lookup(vm->mod, token->content);
        if (!definition) {
            who_printf("undefined name: %s\n", token->content);
            exit(1);
        }

        invoke(vm, definition);
        return;
    }

    case STRING_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case INT_TOKEN: {
        stack_push(vm->value_stack, x_int(string_parse_int(token->content)));
        return;
    }

    case FLOAT_TOKEN: {
        stack_push(vm->value_stack, x_float(string_parse_double(token->content)));
        return;
    }

    case BRACKET_START_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case BRACKET_END_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case QUOTATION_MARK_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case KEYWORD_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case HASHTAG_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case LINE_COMMENT_TOKEN: {
        return;
    }
    }
}
