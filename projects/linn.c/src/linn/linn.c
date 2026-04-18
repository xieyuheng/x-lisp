#include "index.h"

mod_t *
linn_load(path_t *path) {
    mod_t *mod = make_mod(path);
    return mod;
}
