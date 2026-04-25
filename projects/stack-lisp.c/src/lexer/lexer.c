#include "index.h"

lexer_t *make_lexer(const char *string) {
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

void lexer_free(lexer_t *self) {
  free(self);
}

char lexer_next_char(lexer_t *self) {
  return self->string[self->position.index];
}

char *lexer_next_char_string(lexer_t *self) {
  return string_substring(
    self->string,
    self->position.index,
    self->position.index + 1);
}

char *lexer_next_word_string(lexer_t *self) {
  buffer_t *buffer = make_buffer();
  size_t index = self->position.index;
  while (index < self->length &&
       !char_is_blank(self->string[index]) &&
       !lexer_char_is_mark(self, self->string[index]))
  {
    buffer_append_char(buffer, self->string[index]);
    index++;
  }

  char *word = buffer_to_string(buffer);
  buffer_free(buffer);
  return word;
}

bool lexer_is_finished(lexer_t *self) {
  return self->position.index >= self->length;
}

void lexer_forward(lexer_t *self, size_t count) {
  while (!lexer_is_finished(self) && count > 0) {
    count--;
    self->position = position_forward_char(
      self->position,
      lexer_next_char(self));
  }
}

token_t *lexer_consume(lexer_t *self) {
  for (size_t i = 0; i < consumer_count(); i++) {
    struct consumer_t consumer = consumers[i];
    if (consumer.can_consume(self)) {
      struct position_t start = self->position;
      char *content = consumer.consume(self);
      struct position_t end = self->position;
      if (consumer.is_ignored) {
        return NULL;
      } else {
        struct span_t span = { .start = start, .end = end };
        return make_token(consumer.kind, content, span);
      }
    }
  }

  where_printf("can not consume char: %c\n", lexer_next_char(self));
  exit(1);
}

list_t *lexer_lex(lexer_t *self) {
  list_t *tokens = make_list_with((free_fn_t *) token_free);
  while (!lexer_is_finished(self)) {
    token_t *token = lexer_consume(self);
    if (token == NULL) continue;
    list_push(tokens, token);
  }

  return tokens;
}

bool lexer_char_is_mark(lexer_t *self, char c) {
  return (lexer_char_is_quotation_mark(self, c) ||
      lexer_char_is_bracket_start(self, c) ||
      lexer_char_is_bracket_end(self, c));
}

bool lexer_char_is_quotation_mark(lexer_t *self, char c) {
  (void) self;
  return c == '\'' || c == '`' || c == ',';
}

bool lexer_char_is_bracket_start(lexer_t *self, char c) {
  (void) self;
  return c == '(' || c == '[' || c == '{';
}

bool lexer_char_is_bracket_end(lexer_t *self, char c) {
  (void) self;
  return c == ')' || c == ']' || c == '}';
}
