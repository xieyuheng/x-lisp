#include "index.h"

struct mod_t {
    path_t *path;
    char *text;
    hash_t *definitions;
};
