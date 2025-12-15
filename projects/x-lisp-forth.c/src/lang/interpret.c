#include "index.h"

static void invoke(vm_t *vm, definition_t *definition);

void
interpret_token(vm_t *vm, token_t *token) {
    switch (token->kind) {
    case SYMBOL_TOKEN: {
        if (string_equal(token->content, "@dup")) {
            value_t value = stack_pop(vm->value_stack);
            stack_push(vm->value_stack, value);
            stack_push(vm->value_stack, value);
            return;
        }

        if (string_equal(token->content, "@drop")) {
            stack_pop(vm->value_stack);
            return;
        }

        if (string_equal(token->content, "@swap")) {
            value_t x2 = stack_pop(vm->value_stack);
            value_t x1 = stack_pop(vm->value_stack);
            stack_push(vm->value_stack, x2);
            stack_push(vm->value_stack, x1);
            return;
        }

        if (string_equal(token->content, "@assert")) {
            value_t value = stack_pop(vm->value_stack);
            if (value != x_true) {
                printf("@assert fail");
                printf("\n  value: "); value_print(value);
                printf("\n");
                token_meta_report(token->meta);
                exit(1);
            }

            return;
        }

        if (string_equal(token->content, "@assert-equal")) {
            value_t rhs = stack_pop(vm->value_stack);
            value_t lhs = stack_pop(vm->value_stack);
            if (!equal_p(lhs, rhs)) {
                printf("@assert-equal fail");
                printf("\n  lhs: "); value_print(lhs);
                printf("\n  rhs: "); value_print(rhs);
                printf("\n");
                token_meta_report(token->meta);
                exit(1);
            }

            return;
        }

        if (string_equal(token->content, "@assert-not-equal")) {
            value_t rhs = stack_pop(vm->value_stack);
            value_t lhs = stack_pop(vm->value_stack);
            if (equal_p(lhs, rhs)) {
                printf("@assert-not-equal fail");
                printf("\n  lhs: "); value_print(lhs);
                printf("\n  rhs: "); value_print(rhs);
                printf("\n");
                token_meta_report(token->meta);
                exit(1);
            }

            return;
        }

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

static void
invoke(vm_t *vm, definition_t *definition) {
    switch (definition->kind) {
    case FUNCTION_DEFINITION: {
        size_t base_length = stack_length(vm->frame_stack);
        stack_push(vm->frame_stack, make_frame(definition));
        vm_execute_until(vm, base_length);
        return;
    }

    case PRIMITIVE_DEFINITION: {
        call_primitive(vm, definition->primitive_definition.primitive);
        return;
    }

    case VARIABLE_DEFINITION: {
        stack_push(vm->value_stack, definition->variable_definition.value);
        return;
    }

    case CONSTANT_DEFINITION: {
        stack_push(vm->value_stack, definition->variable_definition.value);
        return;
    }

    case PLACEHOLDER_DEFINITION: {
        who_printf("undefined name: %s\n", definition->name);
        assert(false);
    }
    }
}
