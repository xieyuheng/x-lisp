#include "index.h"

token_t *
make_token(token_kind_t kind, char *content, struct token_meta_t meta) {
    token_t *self = new(token_t);
    self->kind = kind;
    self->content = content;
    self->meta = meta;
    return self;
}

void
token_free(token_t *self) {
    free(self->content);
    free(self);
}

void
token_meta_report(struct token_meta_t meta) {
    if (meta.path) {
        printf("%s:%ld:%ld\n",
               path_string(meta.path),
               meta.span.start.row + 1,
               meta.span.end.row + 1);
    }

    if (meta.string) {
        span_report_in_context(meta.span, meta.string);
    }
}
