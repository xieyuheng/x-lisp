#include "index.h"

ordering_t
int_compare_ascending(const void *lhs, const void *rhs) {
    return (int64_t) lhs - (int64_t) rhs;
}

ordering_t
int_compare_descending(const void *lhs, const void *rhs) {
    return (int64_t) rhs - (int64_t) lhs;
}
