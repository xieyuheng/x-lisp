#pragma once

void apply(vm_t *vm, size_t n, value_t target);
void apply_definition(vm_t *vm, size_t n, definition_t *definition);
void apply_curry(vm_t *vm, size_t n, curry_t *curry);
