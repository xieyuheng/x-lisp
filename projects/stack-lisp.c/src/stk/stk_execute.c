#include "index.h"

void stk_execute(mod_t *mod, line_t *line) {
  if (string_equal(line_op_name(line), "fn")) {
    stk_execute_fn(mod, line);
  } else if (string_equal(line_op_name(line), "put")) {
    stk_execute_put(mod, line);
  } else {
    who_printf("unhandled line operation: %s\n", line_op_name(line));
  }
}
