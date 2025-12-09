#include "index.h"

cmd_ctx_t *
cmd_make_ctx(
    const cmd_router_t *router,
    const cmd_route_t *route,
    size_t argc,
    const char **argv
) {
    cmd_ctx_t *self = new(cmd_ctx_t);
    self->router = router;
    self->route = route;
    self->argc = argc;
    self->argv = argv;
    self->args = make_string_array_auto();
    self->options = make_string_record();
    return self;
}

void
cmd_ctx_free(cmd_ctx_t *self) {
    array_free(self->args);
    record_free(self->options);
    free(self);
}
