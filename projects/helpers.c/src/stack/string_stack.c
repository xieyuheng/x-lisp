#include "index.h"

stack_t *
make_string_stack(void) {
    stack_t *self = make_stack_with((free_fn_t *) string_free);
    return self;
}
