#include "index.h"

bool can_consume_symbol(lexer_t *lexer) {
  if (char_is_digit(lexer_next_char(lexer))) return false;
  return true;
}

char *consume_symbol(lexer_t *lexer) {
  buffer_t *buffer = make_buffer();

  while (!lexer_is_finished(lexer) &&
       !char_is_blank(lexer_next_char(lexer)) &&
       !lexer_char_is_mark(lexer, lexer_next_char(lexer)))
  {
    buffer_append_char(buffer, lexer_next_char(lexer));
    lexer_forward(lexer, 1);
  }

  char *content = buffer_to_string(buffer);
  buffer_free(buffer);
  return content;
}
