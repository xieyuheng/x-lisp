#pragma once

struct line_t {
    list_t *tokens;
    array_t *args;
};

line_t *make_line(list_t *tokens);
void line_free(line_t *self);

const char *line_op_name(line_t *self);
path_t *line_path(line_t *self);
value_t *line_get_arg(line_t *self, size_t i);

line_t *parse_line(const char *string);

void line_print(line_t *self);
