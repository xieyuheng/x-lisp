#include "src/deps.h"
// #include "src/gc/index.h"

int64_t begin(void);

int
main(int argc, char *argv[]) {
    uint64_t result = begin();
    printf("%lld\n", result);
    return 0;
}
