#pragma once

void native_apply_set_xvm(xvm_t *xvm);
value_t native_apply(value_t target, uint8_t argc, value_t *args);
