#pragma once

cmd_router_t *
cmd_make_router(const char *name, const char *version) {
    cmd_router_t *self = new(cmd_router_t);
    self->name = name;
    self->version = version;
    self->routes = make_array_auto();
    // self->routes = make_array_auto_with((free_fn_t *) route_free);
    self->handlers = make_hash_with_string_keys();
    return self;
}

void
cmd_router_free(cmd_router_t *self) {
    array_free(self->routes);
    hash_free(self->handlers);
    free(self);
}
