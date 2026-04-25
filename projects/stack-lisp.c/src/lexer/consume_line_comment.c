#include "index.h"

bool can_consume_line_comment(lexer_t *lexer) {
  if (!lexer->line_comment_introducer)
    return false;

  char *word = lexer_next_word_string(lexer);
  bool result = string_equal(word, lexer->line_comment_introducer);
  string_free(word);
  return result;
}

char *consume_line_comment(lexer_t *lexer) {
  buffer_t *buffer = make_buffer();

  while (true) {
    if (lexer_is_finished(lexer)) {
      break;
    }

    char c = lexer_next_char(lexer);
    if (c == '\n') {
      lexer_forward(lexer, 1);
      break;
    }

    buffer_append_char(buffer, c);
    lexer_forward(lexer, 1);
  }

  char *content = buffer_to_string(buffer);
  buffer_free(buffer);
  return content;
}
