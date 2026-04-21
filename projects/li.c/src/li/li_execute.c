#include "index.h"

void li_execute(mod_t *mod, line_t *line) {
  if (string_equal(line_op_name(line), "fn")) {
    li_execute_fn(mod, line);
  } else if (string_equal(line_op_name(line), "put")) {
    li_execute_put(mod, line);
  } else {
    who_printf("unhandled line operation: %s\n", line_op_name(line));
  }
}
