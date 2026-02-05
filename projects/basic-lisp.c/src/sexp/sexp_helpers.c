#include "index.h"

bool
sexp_has_tag(value_t sexp, const char *tag) {
    return tael_p(sexp)
        && false_p(x_list_empty_p(sexp))
        && equal_p(x_car(sexp), x_object(intern_symbol(tag)));
}
