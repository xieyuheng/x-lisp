#include "index.h"

static function_t *
prepare_function(mod_t *mod, const char *name) {
    definition_t *definition = mod_lookup(mod, name);
    if (definition) {
        assert(definition->kind == FUNCTION_DEFINITION);
        return definition->function_definition.function;
    } else {
        function_t *function = make_function();
        define_function(mod, name, function);
        return function;
    }
}

static void
execute_ins_line(mod_t *mod, line_t *line) {
    const path_t *path = line_path(line);
    const char *name = path_raw_string(path);
    function_t *function = prepare_function(mod, name);
    (void) function;
    value_t op = line_get_arg(line, 0);
    print(op);
    newline();
}

void
linn_execute(mod_t *mod, line_t *line) {
    if (string_equal(line_op_name(line), "ins")) {
        execute_ins_line(mod, line);
    } else {
        who_printf("unknown line operation: %s\n", line_op_name(line));
        exit(1);
    }
}
