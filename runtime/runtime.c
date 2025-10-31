#include "src/deps.h"
#include "src/gc/index.h"

int64_t begin(void);

int64_t random_dice(void) {
    return 6;
}

int64_t print_int(int64_t x) {
    printf("%lld", x);
}

void newline(void) {
    printf("\n");
}

gc_t *gc;
void **root_stack;
void **root_pointer;

tuple_t *
make_tuple(size_t size) {
    gc_set_root_pointer(gc, root_pointer);
    return tuple_new(size, gc);
}

void
init() {
    gc = gc_new(2048, 2048);
    gc_expose_root_space(gc, &root_stack);
    root_pointer = root_stack;
}

int
main(int argc, char *argv[]) {
    init();

    uint64_t result = begin();
    printf("%lld\n", result);
    return 0;
}
