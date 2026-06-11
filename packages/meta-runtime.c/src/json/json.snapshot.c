#include "index.h"

static void echo(const char *string) {
  buffer_t *buffer = make_buffer();
  format_json(buffer, parse_json(string));
  format_newline(buffer);
  buffer_write_and_free(buffer, stdout);
}

int main(void) {
  init_global_gc();

  // null / bool

  echo("null");
  echo("true");
  echo("false");

  // number

  echo("0");
  echo("42");
  echo("-17");
  echo("3.14");
  echo("-0.5");

  // string

  echo("\"hello\"");
  echo("\"\\\"quoted\\\"\"");
  echo("\"\\n\\t\\r\"");

  // array

  echo("[]");
  echo("[1, 2, 3]");
  echo("[true, false, null]");
  echo("[\"a\", \"b\"]");
  echo("[[1, 2], [3, 4]]");

  // object

  echo("{}");
  echo("{\"x\": 1, \"y\": 2}");
  echo("{\"name\": \"json\", \"version\": 3.14}");
  echo("{\"nested\": {\"key\": \"value\"}}");
}
