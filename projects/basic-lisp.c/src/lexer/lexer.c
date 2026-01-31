#include "index.h"

lexer_t *
make_lexer(const char *string) {
    lexer_t *self = new(lexer_t);
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

char *
lexer_next_char_string(lexer_t *self) {
    return string_slice(
        self->string,
        self->position.index,
        self->position.index + 1);
}

char *
lexer_next_word_string(lexer_t *self) {
    string_builder_t *builder = make_string_builder();
    size_t index = self->position.index;
    while (index < self->length &&
           !char_is_space(self->string[index]) &&
           !lexer_char_is_mark(self, self->string[index]))
    {
        string_builder_append_char(builder, self->string[index]);
        index++;
    }

    char *word = string_builder_produce(builder);
    string_builder_free(builder);
    return word;
}

bool
lexer_is_finished(lexer_t *self) {
    return self->position.index >= self->length;
}

void
lexer_forward(lexer_t *self, size_t count) {
    while (!lexer_is_finished(self) && count > 0) {
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
    exit(1);
}

list_t *
lexer_lex(lexer_t *self) {
    list_t *tokens = make_list_with((free_fn_t *) token_free);
    while (!lexer_is_finished(self)) {
        token_t *token = lexer_consume(self);
        if (token == NULL) continue;
        list_push(tokens, token);
    }

    return tokens;
}

list_t *
lex(const path_t *path, const char *string) {
    lexer_t *lexer = make_lexer(string);
    lexer->path = path;
    list_t *tokens = lexer_lex(lexer);
    lexer_free(lexer);
    return tokens;
}

bool
lexer_char_is_mark(lexer_t *self, char c) {
    return (lexer_char_is_quotation_mark(self, c) ||
            lexer_char_is_bracket_start(self, c) ||
            lexer_char_is_bracket_end(self, c));
}

bool
lexer_char_is_quotation_mark(lexer_t *self, char c) {
    (void) self;
    return c == '\'' || c == '`' || c == ',';
}

bool
lexer_char_is_bracket_start(lexer_t *self, char c) {
    (void) self;
    return c == '(' || c == '[' || c == '{';
}

bool
lexer_char_is_bracket_end(lexer_t *self, char c) {
    (void) self;
    return c == ')' || c == ']' || c == '}';
}
