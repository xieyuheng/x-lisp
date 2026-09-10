#include <stdlib.h>

#include "index.h"

gc_t *global_gc = NULL;

static void gc_atexit(void) {
  if (global_gc && getenv("XVM_GC_STATS")) {
    gc_print_stats(global_gc);
  }
}

void init_global_gc(void) {
  if (!global_gc) {
    global_gc = make_gc();
    atexit(gc_atexit);
  }
}
