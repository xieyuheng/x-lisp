#include "index.h"

token_t *
make_token(token_kind_t kind, char *content, struct span_t span) {
    token_t *self = new(token_t);
    self->kind = kind;
    self->content = content;
    self->span = span;
    return self;
}

void
token_free(token_t *self) {
    free(self->content);
    free(self);
}

void
source_location_report(const path_t *path, struct span_t span) {
    if (path) {
        printf("%s:%ld:%ld\n",
               path_string(path),
               span.start.row + 1,
               span.end.row + 1);
    }

    file_t *file = open_file_or_fail(path_string(path), "r");
    char *string = file_read_string(file);
    span_report_in_context(span, string);
    string_free(string);
    file_close(file);
}
