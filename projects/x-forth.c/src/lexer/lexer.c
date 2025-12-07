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
    return self;
}

void
lexer_free(lexer_t *self) {
    free(self);
}

char
lexer_next_char(lexer_t *self) {
    return self->string[self->position.index];
}

bool
lexer_is_end(lexer_t *self) {
    return self->position.index >= self->length;
}

void
lexer_forward(lexer_t *self, size_t count) {
    while (!lexer_is_end(self) && count > 0) {
        count--;
        self->position = position_forward_char(
            self->position,
            lexer_next_char(self));
    }
}

token_t *
lexer_consume(lexer_t *self) {
    for (size_t i = 0; i < consumer_count(); i++) {
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

    where_printf("can not consume char: %c", lexer_next_char(self));
    assert(false);
}

list_t *
lex(const path_t *path, const char *string) {
    list_t *tokens = make_list_with((free_fn_t *) token_free);
    lexer_t *lexer = make_lexer(path, string);
    while (!lexer_is_end(lexer)) {
        token_t *token = lexer_consume(lexer);
        if (token == NULL) continue;
        list_push(tokens, token);
    }

    lexer_free(lexer);
    return tokens;
}
