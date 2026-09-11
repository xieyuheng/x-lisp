#include "index.h"

value_t value_from_position(struct position_t position) {
  value_t data = x_make_array();
  value_t tag = x_object(intern_symbol("make-source-position"));
  x_array_push_mut(data, tag);
  x_array_push_mut(data, x_int(position.index));
  x_array_push_mut(data, x_int(position.row));
  x_array_push_mut(data, x_int(position.column));
  return data;
}

value_t value_from_span(struct span_t span) {
  value_t data = x_make_array();
  value_t tag = x_object(intern_symbol("make-source-span"));
  x_array_push_mut(data, tag);
  x_array_push_mut(data, value_from_position(span.start));
  x_array_push_mut(data, value_from_position(span.end));
  return data;
}

value_t value_from_source_location(struct source_location_t location) {
  value_t data = x_make_array();
  value_t tag = x_object(intern_symbol("make-source-location"));
  x_array_push_mut(data, tag);
  x_array_push_mut(data, x_object(make_xtext(location.pathname)));
  x_array_push_mut(data, value_from_span(location.span));
  return data;
}

struct position_t value_to_position(value_t value) {
  return (struct position_t) {
    .index = to_int64(xarray_get(to_xarray(value), 1)),
    .row = to_int64(xarray_get(to_xarray(value), 2)),
    .column = to_int64(xarray_get(to_xarray(value), 3)),
  };
}

struct span_t value_to_span(value_t value) {
  return (struct span_t) {
    .start = value_to_position(xarray_get(to_xarray(value), 1)),
    .end = value_to_position(xarray_get(to_xarray(value), 2)),
  };
}

struct source_location_t value_to_source_location(value_t value) {
  return (struct source_location_t) {
    .pathname = xtext_string(to_xtext(xarray_get(to_xarray(value), 1))),
    .span = value_to_span(xarray_get(to_xarray(value), 2)),
  };
}