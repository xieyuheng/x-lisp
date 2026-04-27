#include "index.h"

value_t value_from_position(struct position_t position) {
  xrecord_t *record = make_xrecord();
  xrecord_put(record, "index", x_int(position.index));
  xrecord_put(record, "row", x_int(position.row));
  xrecord_put(record, "column", x_int(position.column));
  return x_object(record);
}

value_t value_from_span(struct span_t span) {
  xrecord_t *record = make_xrecord();
  xrecord_put(record, "start", value_from_position(span.start));
  xrecord_put(record, "end", value_from_position(span.end));
  return x_object(record);
}

value_t value_from_source_location(value_t path, struct span_t span) {
  xrecord_t *record = make_xrecord();
  xrecord_put(record, "path", path);
  xrecord_put(record, "span", value_from_span(span));
  return x_object(record);
}


struct position_t value_to_position(value_t value) {
  return (struct position_t) {
    .index = to_int64(xrecord_get(to_xrecord(value), "index")),
    .row = to_int64(xrecord_get(to_xrecord(value), "row")),
    .column = to_int64(xrecord_get(to_xrecord(value), "column")),
  };
}

struct span_t value_to_span(value_t value) {
  return (struct span_t) {
    .start = value_to_position(xrecord_get(to_xrecord(value), "start")),
    .end = value_to_position(xrecord_get(to_xrecord(value), "end")),
  };
}
