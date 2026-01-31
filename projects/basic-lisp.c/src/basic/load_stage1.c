#include "index.h"

void
load_stage1(mod_t *mod, value_t sexps) {
    (void) mod;
    size_t length = to_int64(x_list_length(sexps));
    for (size_t i = 0; i < length; i++) {
        value_t sexp = x_list_get(x_int(i), sexps);
        print(sexp);
    }
}
