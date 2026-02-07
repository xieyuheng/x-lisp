#include "index.h"

extern void import_builtin_mod(mod_t *mod);

static record_t *loaded_mods = NULL;
static record_t *mod_bodies = NULL;

static value_t
read_mod_body(path_t *path) {
    if (!mod_bodies) {
        mod_bodies = make_record();
    }

    if (record_has(mod_bodies, path_string(path))) {
        return (value_t) record_get(mod_bodies, path_string(path));
    }

    file_t *file = open_file_or_fail(path_string(path), "r");
    value_t sexps = parse_sexps(path, file_read_string(file));
    record_put(mod_bodies, path_string(path), (void *) sexps);
    return sexps;
}

mod_t *
basic_load(path_t *path) {
    if (!loaded_mods) {
        loaded_mods = make_record();
    }

    if (record_has(loaded_mods, path_string(path))) {
        return record_get(loaded_mods, path_string(path));
    }

    value_t sexps = read_mod_body(path);
    mod_t *mod = make_mod(path);

    import_builtin_mod(mod);
    record_put(loaded_mods, path_string(path), mod);
    basic_prepare(mod, sexps);
    basic_import(mod, sexps);
    return mod;
}

static void
setup_variable(vm_t *vm, definition_t *definition) {
    assert(definition->kind == VARIABLE_DEFINITION);
    if (definition->variable_definition.function) {
        uint8_t *code = definition->variable_definition.function->code_area;
        vm_push_frame(vm, make_frame_from_code(code));
        vm_execute(vm);
        definition->variable_definition.value = vm_pop(vm);
    }
}

static void
setup_variables(vm_t *vm) {
    record_iter_t iter;
    record_iter_init(&iter, vm_mod(vm)->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (definition->kind == VARIABLE_DEFINITION) {
            setup_variable(vm, definition);
        }

        definition = record_iter_next_value(&iter);
    }
}

static void
prepare_tail_call(vm_t *vm, const char *name) {
    definition_t *definition = mod_lookup(vm_mod(vm), name);
    assert(definition);
    uint8_t *code = make_code_from_instrs(1, (struct instr_t[]) {
            { .op = OP_TAIL_CALL,
              .ref.definition = definition },
        });
    vm_push_frame(vm, make_frame_from_code(code));
}

static void
basic_setup(mod_t *mod) {
    vm_t *vm = make_vm(mod);
    setup_variables(vm);
    vm_free(vm);
}

void
basic_compile_loaded_mods(void) {
    record_iter_t iter;
    record_iter_init(&iter, loaded_mods);
    char *key = record_iter_next_key(&iter);
    while (key) {
        mod_t *mod = record_get(loaded_mods, key);
        value_t sexps = (value_t) record_get(mod_bodies, key);
        basic_compile(mod, sexps);
        basic_setup(mod);

        key = record_iter_next_key(&iter);
    }
}

void
basic_run(mod_t *mod) {
    vm_t *vm = make_vm(mod);
    if (mod_lookup(vm_mod(vm), "main")) {
        prepare_tail_call(vm, "main");
    }

    vm_execute(vm);
    vm_free(vm);
}
