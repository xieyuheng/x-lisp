#include "index.h"

vm_t *
make_vm(mod_t *mod, list_t *tokens) {
    vm_t *self = new(vm_t);
    self->mod = mod;
    self->tokens = tokens;
    self->value_stack = make_stack();
    self->frame_stack = make_stack_with((free_fn_t *) frame_free);
    return self;
}

void
vm_free(vm_t *self) {
    list_free(self->tokens);
    stack_free(self->value_stack);
    stack_free(self->frame_stack);
    free(self);
}

void
vm_interpret(vm_t *vm) {
    while (!list_is_empty(vm->tokens)) {
        token_t *token = list_shift(vm->tokens);
        interpret_token(vm, token);
        token_free(token);
    }
}

inline void
vm_execute_instr(vm_t *vm, frame_t *frame, struct instr_t instr) {
    switch (instr.op) {
    case OP_NOP: {
        return;
    }

    case OP_LITERAL_INT: {
        stack_push(vm->value_stack, x_int(instr.literal_int.content));
        return;
    }

    case OP_IADD: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = x_iadd(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case OP_ISUB: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = x_isub(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case OP_IMUL: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = x_imul(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case OP_IDIV: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = x_idiv(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case OP_IMOD: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = x_imod(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case OP_LITERAL_FLOAT: {
        stack_push(vm->value_stack, x_float(instr.literal_float.content));
        return;
    }

    case OP_FADD: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = x_fadd(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case OP_FSUB: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = x_fsub(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case OP_FMUL: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = x_fmul(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case OP_FDIV: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = x_fdiv(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case OP_FMOD: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        value_t result = x_fmul(x1, x2);
        stack_push(vm->value_stack, result);
        return;
    }

    case OP_RETURN: {
        stack_pop(vm->frame_stack);
        frame_free(frame);
        return;
    }

    case OP_CALL: {
        call(vm, instr.call.definition);
        return;
    }

    case OP_TAIL_CALL: {
        stack_pop(vm->frame_stack);
        frame_free(frame);
        call(vm, instr.call.definition);
        return;
    }

    case OP_CONST_LOAD: {
        value_t value = instr.const_load.definition->constant_definition.value;
        stack_push(vm->value_stack, value);
        return;
    }

    case OP_VAR_LOAD: {
        value_t value = instr.var_load.definition->variable_definition.value;
        stack_push(vm->value_stack, value);
        return;
    }

    case OP_VAR_STORE: {
        value_t value = stack_pop(vm->value_stack);
        instr.var_load.definition->variable_definition.value = value;
        return;
    }

    case OP_LOCAL_LOAD: {
        value_t value = array_get(frame->locals, instr.local_load.index);
        stack_push(vm->value_stack, value);
        return;
    }

    case OP_LOCAL_STORE: {
        value_t value = stack_pop(vm->value_stack);
        array_put(frame->locals, instr.local_load.index, value);
        return;
    }

    case OP_JUMP: {
        frame->pc += instr.jump.offset;
        return;
    }

    case OP_JUMP_IF_NOT: {
        value_t value = stack_pop(vm->value_stack);
        if (value == x_true) {
            frame->pc += instr.jump.offset;
        }
        return;
    }

    case OP_LITERAL_STRING: {
        assert(false && "TODO");
    }

    case OP_LITERAL_SYMBOL: {
        assert(false && "TODO");
    }

    case OP_LITERAL_KEYWORD: {
        assert(false && "TODO");
    }

    default: {
        assert(false && "TODO");
    }
    }

    unreachable();
}

inline void
vm_execute_step(vm_t *vm) {
    frame_t *frame = stack_top(vm->frame_stack);
    struct instr_t instr = instr_decode(frame->pc);
    frame->pc += instr_length(instr);
    vm_execute_instr(vm, frame, instr);
}

void
vm_execute(vm_t *vm) {
    while (true) {
        vm_execute_step(vm);
    }
}

void
vm_execute_until(vm_t *vm, size_t base_length) {
    while (stack_length(vm->frame_stack) > base_length) {
        vm_execute_step(vm);
    }
}
