#include "index.h"

value_t
x_make_hash(void) {
    return x_object(make_xhash());
}

value_t
x_any_hash_p(value_t value) {
    return x_bool(xhash_p(value));
}

value_t
x_hash_copy(value_t hash) {
    return x_object(xhash_copy(to_xhash(hash)));
}

value_t
x_hash_length(value_t hash) {
    return x_int(hash_length(to_xhash(hash)->hash));
}

value_t
x_hash_empty_p(value_t hash) {
    return x_bool(hash_is_empty(to_xhash(hash)->hash));
}
