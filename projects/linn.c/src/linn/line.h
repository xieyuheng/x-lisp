#pragma once

struct line_t {
    list_t *tokens;
};

line_t *make_line(list_t *tokens);
void line_free(line_t *self);
