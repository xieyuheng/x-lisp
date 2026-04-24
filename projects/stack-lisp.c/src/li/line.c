#include "index.h"

struct line_t {
  char *op_name;
  path_t *path;
  array_t *args;
};

line_t *make_line(char *op_name, path_t *path, array_t *args) {
  line_t *self = new(line_t);
  self->op_name = op_name;
  self->path = path;
  self->args = args;
  return self;
}

void line_free(line_t *self) {
  string_free(self->op_name);
  path_free(self->path);
  array_free(self->args);
  free(self);
}

static value_t parse_line_arg(list_t *tokens) {
  token_t *token = list_pop_front(tokens);
  switch (token->kind) {
  case SYMBOL_TOKEN: {
    value_t value = x_object(intern_keyword(token->content));
    token_free(token);
    return value;
  }

  case KEYWORD_TOKEN: {
    value_t value = x_object(intern_keyword(token->content));
    token_free(token);
    return value;
  }

  case STRING_TOKEN: {
    value_t value = x_object(make_static_xstring(token->content));
    token_free(token);
    return value;
  }

  case INT_TOKEN: {
    value_t value = x_int(string_parse_int(token->content));
    token_free(token);
    return value;
  }

  case FLOAT_TOKEN: {
    value_t value = x_float(string_parse_double(token->content));
    token_free(token);
    return value;
  }

  case QUOTATION_MARK_TOKEN: {
    if (string_equal(token->content, "'")) {
      token_free(token);
      token = list_pop_front(tokens);
      value_t value = x_object(intern_symbol(token->content));
      token_free(token);
      return value;
    }

    who_printf("unexpected quotation mark: %s\n", token->content);
    exit(1);
  }

  default: {
    who_printf("unhandled token: %s\n", token->content);
    exit(1);
  }
  }
}

line_t *parse_line(const char *string) {
  lexer_t *lexer = make_lexer(string);
  list_t *tokens = lexer_lex(lexer);
  assert(list_length(tokens) >= 2);

  token_t *token = list_pop_front(tokens);
  assert(token->kind == SYMBOL_TOKEN);
  char *op_name = string_copy(token->content);
  token_free(token);

  token = list_pop_front(tokens);
  assert(token->kind == SYMBOL_TOKEN);
  path_t *path = make_path(token->content);
  token_free(token);

  array_t *args = make_array();
  while (list_length(tokens) > 0) {
    value_t value = parse_line_arg(tokens);
    array_push(args, (void *) value);
  }

  line_t *line = make_line(op_name, path, args);
  lexer_free(lexer);
  list_free(tokens);
  return line;
}

const char *line_op_name(line_t *self) {
  return self->op_name;
}

const path_t *line_path(line_t *self) {
  return self->path;
}

value_t line_get_arg(line_t *self, size_t i) {
  assert(i < array_length(self->args));
  return (value_t) array_get(self->args, i);
}

void line_print(line_t *self) {
  string_print(line_op_name(self));
  string_print(" ");
  path_print(line_path(self));
  size_t length = array_length(self->args);
  for (size_t i = 0; i < length; i++) {
    value_t value = line_get_arg(self, i);
    string_print(" ");
    print(value);
  }

  newline();
}
