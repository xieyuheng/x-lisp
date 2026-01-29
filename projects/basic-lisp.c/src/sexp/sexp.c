#include "index.h"

static value_t
parse_sexp_from_tokens(list_t *tokens) {
    (void) tokens;
    assert(false);
}

static value_t
parse_sexps_from_tokens(list_t *tokens) {
    value_t sexps = x_make_list();
    while (!list_is_empty(tokens)) {
        token_t *token = list_first(tokens);
        if (string_equal(token->content, ")")) {
            list_free(tokens);
            return sexps;
        }

        x_list_push_mut(parse_sexp_from_tokens(tokens), sexps);
    }

    return sexps;
}

value_t
parse_sexps(const path_t *path, const char *string) {
    list_t *tokens = lex(path, string);
    return parse_sexps_from_tokens(tokens);
}
