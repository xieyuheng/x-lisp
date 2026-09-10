#include "index.h"

value_t x_make_pair(value_t first, value_t second) {
  value_t pair = x_make_array();
  xarray_push(to_xarray(pair), first);
  xarray_push(to_xarray(pair), second);
  return pair;
}

value_t x_pair_first(value_t pair) {
  return xarray_get(to_xarray(pair), 0);
}

value_t x_pair_second(value_t pair) {
  return xarray_get(to_xarray(pair), 1);
}

value_t x_pair_put_first(value_t value, value_t pair) {
  xarray_put(to_xarray(pair), 0, value);
  return pair;
}

value_t x_pair_put_second(value_t value, value_t pair) {
  xarray_put(to_xarray(pair), 1, value);
  return pair;
}