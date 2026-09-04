#pragma once

void apply(xvm_t *xvm, value_t target, uint8_t argc, const uint16_t *args, value_t *locals);
void apply_closure(xvm_t *xvm, closure_t *closure, uint8_t argc, const uint16_t *args, value_t *locals);
