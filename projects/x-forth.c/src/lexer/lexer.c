#include "index.h"

lexer_t *
make_lexer(const path_t *path, const char *string) {
    lexer_t *self = new(lexer_t);
    self->path = path;
    self->string = string;
    self->length = string_length(string);
    self->position = (struct position_t) {
        .index = 0,
        .row = 0,
        .column = 0,
    };
    self->buffer = allocate(MAX_TOKEN_LENGTH + 1);
    self->buffer_length = 0;
    return self;
}

void
lexer_free(lexer_t *self) {
    free(self->buffer);
    free(self);
}

struct consumer_t consumers[] = {
    { .is_ignored = true }
};

token_t *
lexer_consume(lexer_t *self) {
    size_t length = sizeof(consumers) / sizeof(consumers[0]);
    for (size_t i = 0; i < length; i++) {
        struct consumer_t consumer = consumers[i];
        if (consumer.can_consume(self)) {
            struct position_t start = self->position;
            char *content = consumer.consume(self);
            struct position_t end = self->position;
            if (consumer.is_ignored) {
                return NULL;
            } else {
                struct token_meta_t meta = {
                    .path = self->path,
                    .string = self->string,
                    .span.start = start,
                    .span.end = end,
                };
                return make_token(consumer.kind, content, meta);
            }
        }
    }

    where_printf("can not consume char: %c", self->string[0]);
    assert(false);
}

static bool
lexer_is_end(lexer_t *self) {
    return self->position.index >= self->length;
}

list_t *
lex(const path_t *path, const char *string) {
    list_t *tokens = make_list_with((free_fn_t *) token_free);
    lexer_t *lexer = make_lexer(path, string);
    while (lexer_is_end(lexer)) {
        token_t *token = lexer_consume(lexer);
        if (token == NULL) return NULL;
        list_push(tokens, token);
    }

    return tokens;
}
