#include "index.h"

struct span_t
span_union(struct span_t x, struct span_t y) {
    return (struct span_t) {
        .start = x.start.index < y.start.index ? x.start : y.start,
        .end = x.end.index > y.end.index ? x.end : y.end,
    };
}
