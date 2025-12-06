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

bool
lexer_is_end(lexer_t *self) {
    return self->position.index >= self->length;
}

void
lexer_forward(lexer_t *self, size_t count) {
    while (!lexer_is_end(self) && count) {
        count--;
        self->position = position_forward_char(self->position, self->string[0]);
    }
}

struct consumer_t consumers[] = {
    // The order matters.
    {
        .is_ignored = true,
        .can_consume = can_consume_space,
        .consume = consume_space,
    },
    {
        .kind = QUOTATION_MARK_TOKEN,
        .can_consume = can_consume_quotation_mark,
        .consume = consume_quotation_mark,
    },
    {
        .kind = BRACKET_START_TOKEN,
        .can_consume = can_consume_bracket_start,
        .consume = consume_bracket_start,
    },
    {
        .kind = BRACKET_END_TOKEN,
        .can_consume = can_consume_bracket_end,
        .consume = consume_bracket_end,
    },
    {
        .kind = LINE_COMMENT_TOKEN,
        .can_consume = can_consume_line_comment,
        .consume = consume_line_comment,
    },
    {
        .kind = STRING_TOKEN,
        .can_consume = can_consume_string,
        .consume = consume_string,
    },
    {
        .kind = FLOAT_TOKEN,
        .can_consume = can_consume_float,
        .consume = consume_float,
    },
    {
        .kind = INT_TOKEN,
        .can_consume = can_consume_int,
        .consume = consume_int,
    },
    {
        .kind = KEYWORD_TOKEN,
        .can_consume = can_consume_keyword,
        .consume = consume_keyword,
    },
    {
        .kind = HASHTAG_TOKEN,
        .can_consume = can_consume_hashtag,
        .consume = consume_hashtag,
    },
    {
        .kind = SYMBOL_TOKEN,
        .can_consume = can_consume_symbol,
        .consume = consume_symbol,
    },
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
