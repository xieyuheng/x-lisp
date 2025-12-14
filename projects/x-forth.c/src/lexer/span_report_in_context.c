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

static char *
make_underline(struct span_t span, size_t start, size_t end) {
    string_builder_t *builder = make_string_builder();
    for (size_t i = start; i < end; i++) {
        if (span.start.index <= i && i < span.end.index) {
            string_builder_append_char(builder, '~');
        } else {
            string_builder_append_char(builder, ' ');
        }
    }

    char *content = string_builder_produce(builder);
    string_builder_free(builder);

    if (string_is_blank(content)) {
        string_free(content);
        return NULL;
    } else {
        return content;
    }
}

static void
lines_mark_underline(array_t *lines, struct span_t span) {
    size_t cursor = 0;
    for (size_t i = 0; i < array_length(lines); i++) {
        line_t *line = array_get(lines, i);
        size_t start = cursor;
        size_t end = cursor + string_length(line->content) + 1;
        line->underline = make_underline(span, start, end);
        cursor = end;
    }
}

static bool
line_is_close_to_span(line_t *line, struct span_t span) {
    size_t close_height = 3;
    return ((span.start.row < line->index + close_height) &&
            (line->index < span.end.row + close_height));
}

static size_t
get_prefix_margin(array_t *lines) {
    size_t length = array_length(lines);
    size_t digit_count = 1;
    while (length > 0) {
        length = length / 10;
        digit_count++;
    }

    return digit_count + 1;
}

static void
line_report(line_t *line, size_t prefix_margin) {
    size_t line_count = line->index + 1;
    printf(" %*ld | %s\n", (int) prefix_margin, line_count, line->content);

    if (line->underline) {
        printf(" %*s | %s\n", (int) prefix_margin, "", line->underline);
    }
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

    lines_mark_underline(lines, span);

    size_t prefix_margin = get_prefix_margin(lines);
    for (size_t i = 0; i < array_length(lines); i++) {
        line_t *line = array_get(lines, i);
        if (line_is_close_to_span(line, span)) {
            line_report(line, prefix_margin);
        }
    }

    array_free(lines);
}
