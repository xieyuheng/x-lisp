#pragma once

void call_primitive(xvm_t *xvm, value_t *locals, primitive_fn_t fn, uint8_t argc, const uint16_t *args);
void call_function_now_values(xvm_t *xvm, function_t *fn, uint8_t argc, const uint16_t *args, value_t *locals);
void call_function_now(xvm_t *xvm, function_t *fn);
