#include "index.h"

value_t value_from_position_zh(struct position_t position) {
  value_t data = x_make_array();
  value_t tag = x_object(intern_symbol("作源码坐标"));
  x_array_push_mut(data, tag);
  x_array_push_mut(data, x_int(position.index));
  x_array_push_mut(data, x_int(position.row));
  x_array_push_mut(data, x_int(position.column));
  return data;
}

value_t value_from_span_zh(struct span_t span) {
  value_t data = x_make_array();
  value_t tag = x_object(intern_symbol("作源码区间"));
  x_array_push_mut(data, tag);
  x_array_push_mut(data, value_from_position_zh(span.start));
  x_array_push_mut(data, value_from_position_zh(span.end));
  return data;
}

value_t value_from_source_location_zh(struct source_location_t location) {
  value_t data = x_make_array();
  value_t tag = x_object(intern_symbol("作源码位置"));
  x_array_push_mut(data, tag);
  x_array_push_mut(data, x_object(make_xtext(location.pathname)));
  x_array_push_mut(data, value_from_span_zh(location.span));
  return data;
}