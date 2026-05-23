#include "index.h"

bool can_consume_string(lexer_t *lexer) {
  return lexer_next_char(lexer) == '"';
}

char *consume_string(lexer_t *lexer) {
  lexer_forward(lexer, 1); // over the starting '"'

  buffer_t *buffer = make_buffer();

  while (true) {
    if (lexer_is_finished(lexer)) {
      where_printf("double qouted string mismatch");
      exit(1);
    }

    if (lexer_next_char(lexer) == '"') {
      lexer_forward(lexer, 1); // over the ending '"'
      break;
    }

    char c = lexer_next_char(lexer);
    if (c == '\\') {
      lexer_forward(lexer, 1);

      c = lexer_next_char(lexer);
      // escape char from: https://www.json.org/json-en.html
      if (c == 'n') format_char(buffer, '\n');
      else if (c == 't') format_char(buffer, '\t');
      else if (c == 'b') format_char(buffer, '\b');
      else if (c == 'f') format_char(buffer, '\f');
      else if (c == 'r') format_char(buffer, '\r');
      else if (c == '0') format_char(buffer, '\0');
      else if (c == '"') format_char(buffer, '\"');
      else if (c == '\\') format_char(buffer, '\\');
      else {
        where_printf("unknown escape char");
        exit(1);
      }

      lexer_forward(lexer, 1);
    } else {
      format_char(buffer, c);
      lexer_forward(lexer, 1);
    }
  }

  char *content = buffer_to_string(buffer);
  buffer_free(buffer);
  return content;
}
