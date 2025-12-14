#include "index.h"

struct line_t {
    size_t index;
    char *content;
    char *underline;
};

typedef struct line_t line_t;

static line_t *
make_line(size_t index, char *content) {
    line_t *line = new(line_t);
    line->index = index;
    line->content = content;
    line->underline = NULL;
    return line;
}

static void
line_free(line_t *line) {
    string_free(line->content);
    if (line->underline) {
        string_free(line->underline);
    }

    free(line);
}

void
span_report_in_context(struct span_t span, const char *context) {
    size_t cursor = 0;
    size_t index = 0;
    char *content = string_next_line(context, &cursor);
    array_t *lines = make_array_auto_with((free_fn_t *) line_free);
    while (content) {
        array_push(lines, make_line(index, content));
        content = string_next_line(context, &cursor);
        index++;
    }

    (void) span;

    array_free(lines);
}
