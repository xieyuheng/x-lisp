#include "index.h"

void
linn_execute(mod_t *mod, line_t *line) {
    if (string_equal(line_op_name(line), "ins")) {
        linn_execute_ins(mod, line);
    } else if (string_equal(line_op_name(line), "put")) {
        linn_execute_put(mod, line);
    } else {
        who_printf("unhandled line operation: %s\n", line_op_name(line));
    }
}
