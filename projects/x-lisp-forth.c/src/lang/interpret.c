#include "index.h"

void
interpret_token(vm_t *vm, token_t *token) {
    switch (token->kind) {
    case SYMBOL_TOKEN: {
        if (string_equal(token->content, "@dup")) {
            value_t value = vm_pop(vm);
            vm_push(vm, value);
            vm_push(vm, value);
            return;
        }

        if (string_equal(token->content, "@drop")) {
            vm_pop(vm);
            return;
        }

        if (string_equal(token->content, "@swap")) {
            value_t x2 = vm_pop(vm);
            value_t x1 = vm_pop(vm);
            vm_push(vm, x2);
            vm_push(vm, x1);
            return;
        }

        if (string_equal(token->content, "@assert")) {
            value_t value = vm_pop(vm);
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
            value_t rhs = vm_pop(vm);
            value_t lhs = vm_pop(vm);
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
            value_t rhs = vm_pop(vm);
            value_t lhs = vm_pop(vm);
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

        definition_t *definition = mod_lookup(vm_mod(vm), token->content);
        if (!definition) {
            who_printf("undefined name: %s\n", token->content);
            exit(1);
        }

        call_definition_now(vm, definition);
        return;
    }

    case STRING_TOKEN: {
        assert(false && "TODO");
        return;
    }

    case INT_TOKEN: {
        vm_push(vm, x_int(string_parse_int(token->content)));
        return;
    }

    case FLOAT_TOKEN: {
        vm_push(vm, x_float(string_parse_double(token->content)));
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
