#include "index.h"

value_t x_type_t(void) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("type")));
  return type;
}

value_t x_any_t(void) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("any")));
  return type;
}

value_t x_int_t(void) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("atom")));
  x_array_push_mut(type, x_object(intern_symbol("int")));
  return type;
}

value_t x_float_t(void) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("atom")));
  x_array_push_mut(type, x_object(intern_symbol("float")));
  return type;
}
value_t x_text_t(void) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("atom")));
  x_array_push_mut(type, x_object(intern_symbol("string")));
  return type;
}
value_t x_symbol_t(void) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("atom")));
  x_array_push_mut(type, x_object(intern_symbol("symbol")));
  return type;
}

value_t x_bool_t(void) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("atom")));
  x_array_push_mut(type, x_object(intern_symbol("bool")));
  return type;
}

value_t x_void_t(void) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("atom")));
  x_array_push_mut(type, x_object(intern_symbol("void")));
  return type;
}

value_t x_file_t(void) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("atom")));
  x_array_push_mut(type, x_object(intern_symbol("file")));
  return type;
}

value_t x_list_t(value_t E) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("list")));
  x_array_push_mut(type, E);
  return type;
}

value_t x_array_t(value_t E) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("array")));
  x_array_push_mut(type, E);
  return type;
}

value_t x_set_t(value_t E) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("set")));
  x_array_push_mut(type, E);
  return type;
}

value_t x_hash_t(value_t K, value_t V) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("hash")));
  x_array_push_mut(type, K);
  x_array_push_mut(type, V);
  return type;
}

value_t x_pair_t(value_t A, value_t B) {
  value_t type = x_make_array();
  x_array_push_mut(type, x_object(intern_symbol("pair")));
  x_array_push_mut(type, A);
  x_array_push_mut(type, B);
  return type;
}
