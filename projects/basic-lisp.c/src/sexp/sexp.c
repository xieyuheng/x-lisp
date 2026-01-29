#include "index.h"

static value_t
for_sexp(list_t *tokens) {
    if (list_is_empty(tokens)) {
        where_printf("unexpected end of tokens");
        exit(1);
    }

    token_t *token = list_shift(tokens);
    switch (token->kind) {
    case SYMBOL_TOKEN: {
        value_t sexp = x_object(intern_symbol(token->content));
        token_free(token);
        return sexp;
    }

    case STRING_TOKEN: {
        value_t sexp = x_object(make_xstring_no_gc(string_copy(token->content)));
        token_free(token);
        return sexp;
    }

    case INT_TOKEN: {
        value_t sexp = x_int(string_parse_int(token->content));
        token_free(token);
        return sexp;
    }

    case FLOAT_TOKEN: {
        value_t sexp = x_float(string_parse_double(token->content));
        token_free(token);
        return sexp;
    }

    case BRACKET_START_TOKEN: {
        assert(false && "TODO");
    }

    case BRACKET_END_TOKEN: {
        where_printf("unexpected bracket end: %s", token->content);
        exit(1);
    }

    case QUOTATION_MARK_TOKEN: {
        assert(false && "TODO");
        unreachable();
    }

    case KEYWORD_TOKEN: {
        assert(false && "TODO");
        // value_t key = x_object(intern_symbol(token->content));
        // value_t value =
        // x_record_put_mut(x_float(string_parse_double(token->content)), sexps);
        // token_free(token);
        // return;
        unreachable();
    }

    case HASHTAG_TOKEN: {
        value_t sexp = x_object(intern_hashtag(token->content));
        token_free(token);
        return sexp;
    }

    case LINE_COMMENT_TOKEN: {
        token_free(token);
        return for_sexp(tokens);
    }
    }

    unreachable();
}

value_t
parse_sexps(const path_t *path, const char *string) {
    list_t *tokens = lex(path, string);
    value_t sexps = x_make_list();
    while (!list_is_empty(tokens)) {
        x_list_push_mut(for_sexp(tokens), sexps);
    }

    list_free(tokens);
    return sexps;
}
