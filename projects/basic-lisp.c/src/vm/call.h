#pragma once

void call_primitive(vm_t *vm, const primitive_t *primitive);
void call_function(vm_t *vm, const function_t *function);
void call_function_now(vm_t *vm, const function_t *function);
void call_definition(vm_t *vm, const definition_t *definition);
void call_definition_now(vm_t *vm, const definition_t *definition);
