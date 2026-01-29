#include "index.h"

static value_t for_sexp(list_t *tokens);
static value_t for_tael(const char *end, list_t *tokens);

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
        if (string_equal(token->content, "(")) {
            token_free(token);
            return for_tael(")", tokens);
        } else if (string_equal(token->content, "[")) {
            token_free(token);
            return x_cons(x_object(intern_hashtag("@tael")), for_tael("]", tokens));
        } else if (string_equal(token->content, "{")) {
            token_free(token);
            return x_cons(x_object(intern_hashtag("@set")), for_tael("}", tokens));
        } else {
            where_printf("unexpected bracket start: %s", token->content);
            exit(1);
        }
    }

    case BRACKET_END_TOKEN: {
        where_printf("unexpected bracket end: %s", token->content);
        exit(1);
    }

    case QUOTATION_MARK_TOKEN: {
        value_t inner_sexp = x_object(intern_hashtag(token->content));
        value_t sexp = x_make_list();
        value_t head_sexp = x_void;
        if (string_equal(token->content, "'")) {
            head_sexp = x_object(intern_symbol("@quote"));
        } else if (string_equal(token->content, "`")) {
            head_sexp = x_object(intern_symbol("@quasiquote"));
        } else if (string_equal(token->content, ",")) {
            head_sexp = x_object(intern_symbol("@unquote"));
        } else {
            where_printf("unexpected quasiquote mark: %s", token->content);
            exit(1);
        }

        x_list_push(head_sexp, sexp);
        x_list_push(inner_sexp, sexp);
        token_free(token);
        return sexp;
    }

    case KEYWORD_TOKEN: {
        where_printf("unexpected keyword: %s", token->content);
        exit(1);
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

static value_t
for_tael(const char *end, list_t *tokens) {
    value_t sexp = x_make_list();
    while (true) {
        if (list_is_empty(tokens)) {
            where_printf("unexpected end of tokens");
            exit(1);
        }

        token_t *token = list_first(tokens);
        if (token->kind == BRACKET_END_TOKEN) {
            if (string_equal(token->content, end)) {
                token = list_shift(tokens);
                token_free(token);
                return sexp;
            } else {
                where_printf(
                    "bracket end mismatch, expecting: %s, meet: %s",
                    end, token->content);
                exit(1);
            }
        } else if (token->kind == KEYWORD_TOKEN) {
            value_t key = x_object(intern_symbol(token->content));
            value_t value = for_sexp(tokens);
            x_record_put_mut(key, value, sexp);
            token_free(token);
        } else {
            x_list_push_mut(for_sexp(tokens), sexp);
        }
    }
}
