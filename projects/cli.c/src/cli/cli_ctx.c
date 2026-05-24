#include "index.h"

cli_ctx_t *cli_make_ctx(
  const cli_router_t *router,
  const cli_route_t *route,
  size_t argc,
  char **argv
) {
  cli_ctx_t *self = new(cli_ctx_t);
  self->router = router;
  self->route = route;
  self->argc = argc;
  self->argv = argv;
  self->args = make_string_array();
  self->options = make_string_record();
  self->passthrough = make_string_array();
  return self;
}

void cli_ctx_free(cli_ctx_t *self) {
  array_free(self->args);
  record_free(self->options);
  array_free(self->passthrough);
  free(self);
}
