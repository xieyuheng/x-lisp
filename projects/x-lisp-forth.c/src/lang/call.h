#pragma once

void call_definition(vm_t *vm, const definition_t *definition);
void call_definition_now(vm_t *vm, definition_t *definition);
void call_primitive(vm_t *vm, const primitive_t *primitive);
