#include "index.h"

vm_t *
make_vm(mod_t *mod, list_t *tokens) {
    vm_t *self = new(vm_t);
    self->mod = mod;
    self->tokens = tokens;
    self->value_stack = make_stack();
    self->frame_stack = make_stack_with((free_fn_t *) frame_free);
    self->gc = make_gc();
    return self;
}

void
vm_free(vm_t *self) {
    list_free(self->tokens);
    stack_free(self->value_stack);
    stack_free(self->frame_stack);
    gc_free(self->gc);
    free(self);
}

void
vm_interpret(vm_t *vm) {
    while (!list_is_empty(vm->tokens)) {
        token_t *token = list_shift(vm->tokens);
        interpret_token(vm, token);
        token_free(token);
        vm_perform_gc(vm);
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
        call_definition(vm, instr.call.definition);
        return;
    }

    case OP_TAIL_CALL: {
        stack_pop(vm->frame_stack);
        frame_free(frame);
        call_definition(vm, instr.tail_call.definition);
        return;
    }

    case OP_REF: {
        stack_push(vm->value_stack, x_object(instr.ref.definition));
        return;
    }

    case OP_APPLY: {
        value_t n = stack_pop(vm->value_stack);
        value_t target = stack_pop(vm->value_stack);
        apply(vm, to_int64(n), target);
        return;
    }

    case OP_TAIL_APPLY: {
        value_t n = stack_pop(vm->value_stack);
        value_t target = stack_pop(vm->value_stack);
        stack_pop(vm->frame_stack);
        frame_free(frame);
        apply(vm, to_int64(n), target);
        return;
    }

    case OP_ASSIGN: {
        value_t value = stack_pop(vm->value_stack);
        definition_t *definition = (definition_t *) to_object(value);
        if (definition->kind != VARIABLE_DEFINITION) {
            who_printf("not VARIABLE_DEFINITION: ");
            definition_print(definition);
            printf("\n");
            exit(1);
        }

        definition->variable_definition.value = stack_pop(vm->value_stack);
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
        if (value == x_false) {
            frame->pc += instr.jump.offset;
        }
        return;
    }

    case OP_DUP: {
        value_t value = stack_pop(vm->value_stack);
        stack_push(vm->value_stack, value);
        stack_push(vm->value_stack, value);
        return;
    }

    case OP_DROP: {
        stack_pop(vm->value_stack);
        return;
    }

    case OP_SWAP: {
        value_t x2 = stack_pop(vm->value_stack);
        value_t x1 = stack_pop(vm->value_stack);
        stack_push(vm->value_stack, x2);
        stack_push(vm->value_stack, x1);
        return;
    }

    case OP_ASSERT: {
        value_t value = stack_pop(vm->value_stack);
        if (value != x_true) {
            printf("@assert fail");
            printf("\n  value: "); value_print(value);
            printf("\n");
            token_meta_report(instr.assert.token->meta);
            exit(1);
        }

        return;
    }

    case OP_ASSERT_EQUAL: {
        value_t rhs = stack_pop(vm->value_stack);
        value_t lhs = stack_pop(vm->value_stack);
        if (!equal_p(lhs, rhs)) {
            printf("@assert-equal fail");
            printf("\n  lhs: "); value_print(lhs);
            printf("\n  rhs: "); value_print(rhs);
            printf("\n");
            token_meta_report(instr.assert_equal.token->meta);
            exit(1);
        }

        return;
    }

    case OP_ASSERT_NOT_EQUAL: {
        value_t rhs = stack_pop(vm->value_stack);
        value_t lhs = stack_pop(vm->value_stack);
        if (equal_p(lhs, rhs)) {
            printf("@assert-not-equal fail");
            printf("\n  lhs: "); value_print(lhs);
            printf("\n  rhs: "); value_print(rhs);
            printf("\n");
            token_meta_report(instr.assert_not_equal.token->meta);
            exit(1);
        }

        return;
    }

    case OP_LITERAL_STRING: {
        value_t value =
            x_object(make_xstring(vm->gc, instr.literal_string.content));
        stack_push(vm->value_stack, value);
        return;
    }

    case OP_LITERAL_SYMBOL: {
        assert(false && "TODO");
    }

    case OP_LITERAL_KEYWORD: {
        assert(false && "TODO");
    }
    }
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

static void
vm_gc_roots_in_value_stack(vm_t *vm, array_t *roots) {
    for (size_t i = 0; i < stack_length(vm->value_stack); i++) {
        value_t value = stack_get(vm->value_stack, i);
        if (object_p(value)) {
            array_push(roots, to_object(value));
        }
    }
}

static void
vm_gc_roots_in_frame_stack(vm_t *vm, array_t *roots) {
    for (size_t i = 0; i < stack_length(vm->frame_stack); i++) {
        frame_t *frame = stack_get(vm->frame_stack, i);
        for (size_t i = 0; i < array_length(frame->locals); i++) {
            value_t value = array_get(frame->locals, i);
            if (object_p(value)) {
                array_push(roots, to_object(value));
            }
        }
    }
}

static void
vm_gc_roots_in_mod(vm_t *vm, array_t *roots) {
    definition_t *definition = record_first_value(vm->mod->definitions);
    while (definition) {
        if (definition->kind == CONSTANT_DEFINITION) {
            value_t value = definition->constant_definition.value;
            if (object_p(value)) {
                array_push(roots, to_object(value));
            }
        } else if (definition->kind == VARIABLE_DEFINITION) {
            value_t value = definition->variable_definition.value;
            if (object_p(value)) {
                array_push(roots, to_object(value));
            }
        }

        definition = record_next_value(vm->mod->definitions);
    }
}

static array_t *
vm_gc_roots(vm_t *vm) {
    array_t *roots = make_array();
    vm_gc_roots_in_value_stack(vm, roots);
    vm_gc_roots_in_frame_stack(vm, roots);
    vm_gc_roots_in_mod(vm, roots);
    return roots;
}

void
vm_perform_gc(vm_t *vm) {
#if DEBUG_GC
    who_printf("before\n");
    gc_report(vm->gc);
#endif

    array_t *roots = vm_gc_roots(vm);
    for (size_t i = 0; i < array_length(roots); i++) {
        gc_mark_object(vm->gc, array_get(roots, i));
    }

    gc_mark(vm->gc);
    gc_sweep(vm->gc);
    array_free(roots);

#if DEBUG_GC
    who_printf("after\n");
    gc_report(vm->gc);
#endif
}
