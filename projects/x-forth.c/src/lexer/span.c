#include "index.h"

struct span_t
span_union(struct span_t x, struct span_t y) {
    return (struct span_t) {
        .start = x.start.index < y.start.index ? x.start : y.start,
        .end = x.end.index > y.end.index ? x.end : y.end,
    };
}

struct span_position_t
span_position_forward_char(struct span_position_t position, char c) {
    position.index++;

    if (c == '\n') {
        position.column = 0;
        position.row++;
    } else {
        position.column++;
    }

    return position;
}
