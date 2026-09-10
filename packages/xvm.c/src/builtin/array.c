#include "index.h"

value_t x_make_array(void) {
  return x_object(make_xarray());
}

value_t x_is_any_array(value_t value) {
  return x_bool(is_xarray(value));
}

value_t x_array_copy(value_t array) {
  return x_object(xarray_copy(to_xarray(array)));
}

value_t x_array_length(value_t array) {
  return x_int(array_length(to_xarray(array)->elements));
}

value_t x_array_is_empty(value_t array) {
  return x_bool(array_is_empty(to_xarray(array)->elements));
}

value_t x_array_pop_mut(value_t array) {
  if (array_is_empty(to_xarray(array)->elements)) {
    who_printf("(array-pop) empty array\n");
    exit(1);
  }
  return xarray_pop(to_xarray(array));
}

value_t x_array_push_mut(value_t value, value_t array) {
  xarray_push(to_xarray(array), value);
  return x_void;
}

value_t x_array_pop_front_mut(value_t array) {
  if (array_is_empty(to_xarray(array)->elements)) {
    who_printf("(array-pop-front) empty array\n");
    exit(1);
  }
  return xarray_pop_front(to_xarray(array));
}

value_t x_array_push_front_mut(value_t value, value_t array) {
  xarray_push_front(to_xarray(array), value);
  return x_void;
}

value_t x_array_get(value_t index, value_t array) {
  size_t i = to_int64(index);
  size_t length = array_length(to_xarray(array)->elements);
  if (i >= length) {
    who_printf("(array-get) index out of range: index = %zu, length = %zu\n", i, length);
    exit(1);
  }
  return xarray_get(to_xarray(array), i);
}

value_t x_array_put_mut(value_t index, value_t value, value_t array) {
  size_t i = to_int64(index);
  size_t length = array_length(to_xarray(array)->elements);
  if (i >= length) {
    who_printf("(array-put) index out of range: index = %zu, length = %zu\n", i, length);
    exit(1);
  }
  xarray_put(to_xarray(array), i, value);
  return x_void;
}

value_t x_array_reverse_mut(value_t array) {
  array_reverse(to_xarray(array)->elements);
  return x_void;
}

value_t x_array_to_list(value_t array) {
  size_t length = array_length(to_xarray(array)->elements);
  value_t list = x_null;
  for (size_t i = length; i > 0; i--) {
    list = x_cons(xarray_get(to_xarray(array), i - 1), list);
  }

  return list;
}

value_t x_list_to_array(value_t list) {
  value_t array = x_make_array();
  while (is_cons(list)) {
    xarray_push(to_xarray(array), to_cons(list)->car);
    list = to_cons(list)->cdr;
  }

  return array;
}