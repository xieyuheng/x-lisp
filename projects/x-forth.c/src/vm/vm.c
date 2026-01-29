#include "index.h"

struct vm_t {
    mod_t *mod;
    list_t *tokens;
    stack_t *value_stack;
    stack_t *frame_stack;
};

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

mod_t *
vm_mod(const vm_t *self) {
    return self->mod;
}

inline value_t
vm_pop(vm_t *vm) {
    return (value_t) stack_pop(vm->value_stack);
}

inline void
vm_push(vm_t *vm, value_t value) {
    stack_push(vm->value_stack, (void *) value);
}

inline frame_t *
vm_top_frame(const vm_t *vm) {
    return stack_top(vm->frame_stack);
}

inline void
vm_drop_frame(vm_t *vm) {
    stack_pop(vm->frame_stack);
    vm_perform_gc(vm);
}

inline void
vm_push_frame(vm_t *vm, frame_t *frame) {
    stack_push(vm->frame_stack, frame);
}

inline size_t
vm_frame_count(const vm_t *vm) {
    return stack_length(vm->frame_stack);
}

token_t *
vm_next_token(vm_t *vm) {
    return list_shift(vm->tokens);
}

bool
vm_no_more_tokens(vm_t *vm) {
    return list_is_empty(vm->tokens);
}

inline void
vm_execute_instr(vm_t *vm, frame_t *frame, struct instr_t instr) {
    switch (instr.op) {
    case OP_NOP: {
        return;
    }

    case OP_LITERAL: {
        vm_push(vm, instr.literal.value);
        return;
    }

    case OP_IADD: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = x_iadd(x1, x2);
        vm_push(vm, result);
        return;
    }

    case OP_ISUB: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = x_isub(x1, x2);
        vm_push(vm, result);
        return;
    }

    case OP_IMUL: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = x_imul(x1, x2);
        vm_push(vm, result);
        return;
    }

    case OP_IDIV: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = x_idiv(x1, x2);
        vm_push(vm, result);
        return;
    }

    case OP_IMOD: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = x_imod(x1, x2);
        vm_push(vm, result);
        return;
    }

    case OP_FADD: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = x_fadd(x1, x2);
        vm_push(vm, result);
        return;
    }

    case OP_FSUB: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = x_fsub(x1, x2);
        vm_push(vm, result);
        return;
    }

    case OP_FMUL: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = x_fmul(x1, x2);
        vm_push(vm, result);
        return;
    }

    case OP_FDIV: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = x_fdiv(x1, x2);
        vm_push(vm, result);
        return;
    }

    case OP_FMOD: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        value_t result = x_fmul(x1, x2);
        vm_push(vm, result);
        return;
    }

    case OP_RETURN: {
        stack_pop(vm->frame_stack);
        frame_free(frame);
        return;
    }

    case OP_CALL: {
        // assert(instr.ref.definition);
        call_definition(vm, instr.ref.definition);
        return;
    }

    case OP_TAIL_CALL: {
        stack_pop(vm->frame_stack);
        frame_free(frame);
        // assert(instr.ref.definition);
        call_definition(vm, instr.ref.definition);
        return;
    }

    case OP_REF: {
        vm_push(vm, x_object(instr.ref.definition));
        return;
    }

    case OP_APPLY: {
        value_t n = vm_pop(vm);
        value_t target = vm_pop(vm);
        apply(vm, to_int64(n), target);
        return;
    }

    case OP_TAIL_APPLY: {
        value_t n = vm_pop(vm);
        value_t target = vm_pop(vm);
        stack_pop(vm->frame_stack);
        frame_free(frame);
        apply(vm, to_int64(n), target);
        return;
    }

    case OP_ASSIGN: {
        value_t value = vm_pop(vm);
        definition_t *definition = (definition_t *) to_object(value);
        if (definition->kind != VARIABLE_DEFINITION) {
            who_printf("expecting VARIABLE_DEFINITION\n");
            who_printf("  definition: "); print(x_object(definition)); newline();
            exit(1);
        }

        definition->variable_definition.value = vm_pop(vm);
        return;
    }

    case OP_LOCAL_LOAD: {
        value_t value = frame_get_local(frame, instr.local.index);
        vm_push(vm, value);
        return;
    }

    case OP_LOCAL_STORE: {
        value_t value = vm_pop(vm);
        frame_put_local(frame, instr.local.index, value);
        return;
    }

    case OP_JUMP: {
        frame->pc += instr.jump.offset;
        return;
    }

    case OP_JUMP_IF_NOT: {
        value_t value = vm_pop(vm);
        if (value == x_false) {
            frame->pc += instr.jump.offset;
        }
        return;
    }

    case OP_DUP: {
        value_t value = vm_pop(vm);
        vm_push(vm, value);
        vm_push(vm, value);
        return;
    }

    case OP_DROP: {
        vm_pop(vm);
        return;
    }

    case OP_SWAP: {
        value_t x2 = vm_pop(vm);
        value_t x1 = vm_pop(vm);
        vm_push(vm, x2);
        vm_push(vm, x1);
        return;
    }

    case OP_ASSERT: {
        value_t value = vm_pop(vm);
        if (value != x_true) {
            printf("@assert fail");
            printf("\n  value: "); print(value);
            printf("\n");
            token_meta_report(instr.assert.token->meta);
            exit(1);
        }

        return;
    }

    case OP_ASSERT_EQUAL: {
        value_t rhs = vm_pop(vm);
        value_t lhs = vm_pop(vm);
        if (!equal_p(lhs, rhs)) {
            printf("@assert-equal fail");
            printf("\n  lhs: "); print(lhs);
            printf("\n  rhs: "); print(rhs);
            printf("\n");
            token_meta_report(instr.assert.token->meta);
            exit(1);
        }

        return;
    }

    case OP_ASSERT_NOT_EQUAL: {
        value_t rhs = vm_pop(vm);
        value_t lhs = vm_pop(vm);
        if (equal_p(lhs, rhs)) {
            printf("@assert-not-equal fail");
            printf("\n  lhs: "); print(lhs);
            printf("\n  rhs: "); print(rhs);
            printf("\n");
            token_meta_report(instr.assert.token->meta);
            exit(1);
        }

        return;
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
    while (vm_frame_count(vm) > 0) {
        vm_execute_step(vm);
    }
}

static void
vm_gc_roots_in_value_stack(vm_t *vm, array_t *roots) {
    for (size_t i = 0; i < stack_length(vm->value_stack); i++) {
        value_t value = (value_t) stack_get(vm->value_stack, i);
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
            value_t value = frame_get_local(frame, i);
            if (object_p(value)) {
                array_push(roots, to_object(value));
            }
        }
    }
}

static void
vm_gc_roots_in_mod(vm_t *vm, array_t *roots) {
    record_iter_t iter;
    record_iter_init(&iter, vm_mod(vm)->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        if (definition->kind == VARIABLE_DEFINITION) {
            value_t value = definition->variable_definition.value;
            if (object_p(value)) {
                array_push(roots, to_object(value));
            }
        }

        definition = record_iter_next_value(&iter);
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
    gc_report(global_gc);
#endif

    array_t *roots = vm_gc_roots(vm);
    for (size_t i = 0; i < array_length(roots); i++) {
        gc_mark_object(global_gc, array_get(roots, i));
    }

    gc_mark(global_gc);
    gc_sweep(global_gc);
    array_free(roots);

#if DEBUG_GC
    who_printf("after\n");
    gc_report(global_gc);
#endif
}
