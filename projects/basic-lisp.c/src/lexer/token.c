#include "index.h"

token_t *
make_token(token_kind_t kind, char *content, struct source_location_t location) {
    token_t *self = new(token_t);
    self->kind = kind;
    self->content = content;
    self->location = location;
    return self;
}

void
token_free(token_t *self) {
    free(self->content);
    free(self);
}

void
source_location_report(struct source_location_t location) {
    if (location.path) {
        printf("%s:%ld:%ld\n",
               path_string(location.path),
               location.span.start.row + 1,
               location.span.end.row + 1);
    }

    file_t *file = open_file_or_fail(path_string(location.path), "r");
    char *string = file_read_string(file);
    span_report_in_context(location.span, string);
    string_free(string);
    file_close(file);
}
