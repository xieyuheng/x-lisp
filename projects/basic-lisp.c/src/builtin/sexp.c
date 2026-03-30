#include "index.h"

value_t x_parse_located_sexps(value_t path, value_t string) {
    return parse_located_sexps(
        to_xstring(path)->string,
        to_xstring(string)->string);
}
