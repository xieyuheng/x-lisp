#pragma once

struct position_t {
    size_t index, row, column;
};

struct position_t position_forward_char(struct position_t, char);

struct span_t {
    struct position_t start, end;
};

struct span_t span_union(struct span_t, struct span_t);

void span_report_in_context(struct span_t span, const char *context);
