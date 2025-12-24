#include "index.h"

gc_t *global_gc = NULL;

void
init_global_gc(void) {
    if (!global_gc) {
        global_gc = make_gc();
    }
}
