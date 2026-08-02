#include "index.h"

// ── Chinese constructors ──

static value_t value_from_position_zh(struct position_t position) {
  value_t data = x_make_list();
  value_t tag = x_object(intern_symbol("作源码坐标"));
  x_list_push_mut(tag, data);
  x_list_push_mut(x_int(position.index), data);
  x_list_push_mut(x_int(position.row), data);
  x_list_push_mut(x_int(position.column), data);
  return data;
}

value_t value_from_span_zh(struct span_t span) {
  value_t data = x_make_list();
  value_t tag = x_object(intern_symbol("作源码区间"));
  x_list_push_mut(tag, data);
  x_list_push_mut(value_from_position_zh(span.start), data);
  x_list_push_mut(value_from_position_zh(span.end), data);
  return data;
}

value_t value_from_source_location_zh(struct source_location_t location) {
  value_t data = x_make_list();
  value_t tag = x_object(intern_symbol("作源码位置"));
  x_list_push_mut(tag, data);
  x_list_push_mut(x_object(make_xstring(location.pathname)), data);
  x_list_push_mut(value_from_span_zh(location.span), data);
  return data;
}
