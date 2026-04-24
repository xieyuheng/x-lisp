#include "index.h"

value_t x_type_t(void) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("type")), type);
  return type;
}

value_t x_int_t(void) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("atom")), type);
  x_list_push_mut(x_object(intern_symbol("int")), type);
  return type;
}

value_t x_float_t(void) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("atom")), type);
  x_list_push_mut(x_object(intern_symbol("float")), type);
  return type;
}
value_t x_string_t(void) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("atom")), type);
  x_list_push_mut(x_object(intern_symbol("string")), type);
  return type;
}
value_t x_symbol_t(void) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("atom")), type);
  x_list_push_mut(x_object(intern_symbol("symbol")), type);
  return type;
}

value_t x_keyword_t(void) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("atom")), type);
  x_list_push_mut(x_object(intern_symbol("keyword")), type);
  return type;
}

value_t x_void_t(void) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("atom")), type);
  x_list_push_mut(x_object(intern_symbol("void")), type);
  return type;
}

value_t x_file_t(void) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("atom")), type);
  x_list_push_mut(x_object(intern_symbol("file")), type);
  return type;
}

value_t x_list_t(value_t E) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("list")), type);
  x_list_push_mut(E, type);
  return type;
}

value_t x_set_t(value_t E) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("set")), type);
  x_list_push_mut(E, type);
  return type;
}

value_t x_hash_t(value_t K, value_t V) {
  value_t type = x_make_list();
  x_list_push_mut(x_object(intern_symbol("hash")), type);
  x_list_push_mut(K, type);
  x_list_push_mut(V, type);
  return type;
}
