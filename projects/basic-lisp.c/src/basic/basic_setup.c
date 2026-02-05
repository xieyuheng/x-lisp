#include "index.h"

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

void
basic_setup(mod_t *mod) {
    vm_t *vm = make_vm(mod);
    setup_variables(vm);
    vm_free(vm);
}

void
basic_run_main(mod_t *mod) {
    vm_t *vm = make_vm(mod);
    if (mod_lookup(vm_mod(vm), "main")) {
        prepare_tail_call(vm, "main");
    }

    vm_execute(vm);
    vm_free(vm);
}
