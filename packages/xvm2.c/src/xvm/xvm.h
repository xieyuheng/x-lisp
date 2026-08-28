#pragma once

struct xvm_t {
  value_t result;
};

xvm_t *make_xvm(void);
void xvm_free(xvm_t *self);
