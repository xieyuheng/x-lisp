#include "index.h"

// [start, end)

int64_t random_int(int64_t start, int64_t end) {
  assert(start < end);
  double r = (double) rand() / (RAND_MAX + 1.0); // [0, 1)
  return start + (int64_t) (r * (end - start));
}

double random_float(double start, double end) {
  assert(start < end);
  double r = (double) rand() / (RAND_MAX + 1.0); // [0, 1)
  return start + r * (end - start);
}
