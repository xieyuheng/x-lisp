#pragma once

cmd_router_t *
cmd_make_router_t(const char *name, const char *version) {
    cmd_router_t *self = new(cmd_router_t);
    self->name = name;
    self->version = version;
    return self;
}
