#include "index.h"

value_t x_closure_put_arg_mut(value_t index_val, value_t value, value_t closure_val) {
  size_t index = (size_t) to_int64(index_val);
  closure_t *closure = to_closure(closure_val);
  closure->args[index] = value;
  return x_object(closure);
}

value_t x_closure_arg(value_t index_val, value_t closure_val) {
  size_t index = (size_t) to_int64(index_val);
  closure_t *closure = to_closure(closure_val);
  return closure->args[index];
}
