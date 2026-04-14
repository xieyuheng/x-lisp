#include "index.h"

extern void import_builtin(mod_t *mod);

static value_t
read_mod_body(path_t *path) {
    file_t *file = open_file_or_fail(path_raw_string(path), "r");
    value_t sexps = parse_sexps(file_read_string(file));
    return sexps;
}

mod_t *
basic_load(path_t *path) {
    value_t sexps = read_mod_body(path);
    mod_t *mod = make_mod(path);
    import_builtin(mod);
    basic_prepare(mod, sexps);
    basic_compile(mod, sexps);
    return mod;
}

static void
setup_variables(vm_t *vm) {
    record_iter_t iter;
    record_iter_init(&iter, vm_mod(vm)->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (definition->kind == VARIABLE_DEFINITION
            && definition->variable_definition.function) {
            function_t *function = definition_function(definition);
            vm_push_frame(vm, make_function_frame(function));
            vm_execute(vm);
            definition->variable_definition.value = vm_pop(vm);
        }

        definition = record_iter_next_value(&iter);
    }
}

void
basic_setup(mod_t *mod) {
    vm_t *vm = make_vm(mod);
    setup_variables(vm);
    vm_free(vm);
}

void
basic_run(mod_t *mod, const char *function_name) {
    definition_t *definition = mod_lookup(mod, function_name);
    if (!definition) {
        who_printf("undefined function: %s\n", function_name);
        exit(1);
    }

    vm_t *vm = make_vm(mod);
    call_definition_now(vm, definition);
    vm_free(vm);
}
