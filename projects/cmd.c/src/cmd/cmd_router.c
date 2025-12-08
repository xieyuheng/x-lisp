#include "index.h"

struct cmd_router_t {
    const char *name;
    const char *version;

    array_t *routes;
    hash_t *handlers;
};

cmd_router_t *cmd_make_router_t(const char *name, const char *version);
