#include "index.h"

ordering_t
int_compare_ascending(const void *lhs, const void *rhs) {
    return (int64_t) lhs - (int64_t) rhs;
}

ordering_t
int_compare_descending(const void *lhs, const void *rhs) {
    return (int64_t) rhs - (int64_t) lhs;
}

ordering_t
uint_compare_ascending(const void *lhs, const void *rhs) {
    if ((uint64_t) lhs < (uint64_t) rhs) return -1;
    else if ((uint64_t) lhs > (uint64_t) rhs) return 1;
    else return 0;
}

ordering_t
uint_compare_descending(const void *lhs, const void *rhs) {
    if ((uint64_t) lhs < (uint64_t) rhs) return 1;
    else if ((uint64_t) lhs > (uint64_t) rhs) return -1;
    else return 0;
}
