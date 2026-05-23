#pragma once

void call_primitive_now(xvm_t *xvm, const primitive_t *primitive);
void call_function(xvm_t *xvm, const function_t *function);
void call_function_now(xvm_t *xvm, const function_t *function);
void call_definition(xvm_t *xvm, const definition_t *definition);
void call_definition_now(xvm_t *xvm, const definition_t *definition);
