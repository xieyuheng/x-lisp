#pragma once

void call_primitive(xvm_t *xvm, value_t *locals,
                    const primitive_t *primitive, uint8_t argc, const uint16_t *args);
void call_function_now(xvm_t *xvm, const function_t *function);
void call_function_now_with_args(xvm_t *xvm, const function_t *function,
                                  uint8_t argc, const uint16_t *args, value_t *caller_locals);
void call_definition_now(xvm_t *xvm, const definition_t *definition);
void call_definition_now_with_args(xvm_t *xvm, const definition_t *definition,
                                    uint8_t argc, const uint16_t *args, value_t *caller_locals);
