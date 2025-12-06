#pragma once

struct span_position_t {
    size_t index, row, column;
};

struct span_t {
    struct span_position_t start, end;
};

struct span_t span_union(struct span_t x, struct span_t y);
