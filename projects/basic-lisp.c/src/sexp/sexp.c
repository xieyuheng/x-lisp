#include "index.h"

static value_t
parse_sexps_from_tokens(list_t *tokens) {
    (void) tokens;
    assert(false);
}

// static value_t
// parse_sexp_from_tokens(list_t *tokens) {
//     (void) tokens;
//     assert(false);
// }

value_t
parse_sexps(const path_t *path, const char *string) {
    list_t *tokens = lex(path, string);
    return parse_sexps_from_tokens(tokens);
}
