#include "index.h"

struct cmd_router_t {
    const char *name;
    const char *version;

    array_t *routes;
    hash_t *handlers;
};
