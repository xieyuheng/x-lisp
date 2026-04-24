#include "index.h"

value_t x_parse_located_sexps(value_t path, value_t string) {
  return parse_located_sexps(
    xstring_string(to_xstring(path)),
    xstring_string(to_xstring(string)));
}
