#include "index.h"

xvm_t *make_xvm(void) {
  xvm_t *self = new(xvm_t);
  self->result = x_void;
  return self;
}

void xvm_free(xvm_t *self) {
  free(self);
}
