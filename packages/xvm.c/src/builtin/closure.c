#include "index.h"

value_t x_make_closure(value_t def_val, value_t size_val) {
  definition_t *def = to_definition(def_val);
  size_t size = (size_t) to_int64(size_val);
  return x_object(make_closure(def, size));
}

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
