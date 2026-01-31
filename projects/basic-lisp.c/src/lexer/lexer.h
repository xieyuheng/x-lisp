#pragma once

struct lexer_t {
    const path_t *path;
    const char *string;
    size_t length;
    struct position_t position;
    const char *line_comment_introducer;
};

lexer_t *make_lexer(const char *string);
void lexer_free(lexer_t *self);

char lexer_next_char(lexer_t *self);
char *lexer_next_char_string(lexer_t *self);
char *lexer_next_word_string(lexer_t *self);

bool lexer_is_finished(lexer_t *self);
void lexer_forward(lexer_t *self, size_t count);
token_t *lexer_consume(lexer_t *self);
list_t *lexer_lex(lexer_t *self);
list_t *lex(const path_t *path, const char *string);

bool lexer_char_is_mark(lexer_t *self, char c);
bool lexer_char_is_bracket_end(lexer_t *self, char c);
bool lexer_char_is_bracket_start(lexer_t *self, char c);
bool lexer_char_is_quotation_mark(lexer_t *self, char c);
