#include "index.h"

inline ordering_t int_compare_ascending(const void *lhs, const void *rhs) {
  if ((int64_t) lhs < (int64_t) rhs) return -1;
  if ((int64_t) lhs > (int64_t) rhs) return 1;
  return 0;
}

inline ordering_t int_compare_descending(const void *lhs, const void *rhs) {
  if ((int64_t) lhs < (int64_t) rhs) return 1;
  if ((int64_t) lhs > (int64_t) rhs) return -1;
  return 0;
}

inline ordering_t uint_compare_ascending(const void *lhs, const void *rhs) {
  if ((uint64_t) lhs < (uint64_t) rhs) return -1;
  else if ((uint64_t) lhs > (uint64_t) rhs) return 1;
  else return 0;
}

inline ordering_t uint_compare_descending(const void *lhs, const void *rhs) {
  if ((uint64_t) lhs < (uint64_t) rhs) return 1;
  else if ((uint64_t) lhs > (uint64_t) rhs) return -1;
  else return 0;
}

inline ordering_t string_compare_lexical(const void *lhs, const void *rhs) {
  int ordering = strcmp(lhs, rhs);
  if (ordering < 0) return -1;
  if (ordering > 0) return 1;
  return 0;
}
