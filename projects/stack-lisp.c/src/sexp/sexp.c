#include "index.h"

static void ignore_line_comments(list_t *tokens);

static value_t for_sexp(list_t *tokens);
static value_t for_list(const char *end, list_t *tokens);

value_t parse_sexps(const char *string) {
  lexer_t *lexer = make_lexer(string);
  lexer->line_comment_introducer = ";;";
  list_t *tokens = lexer_lex(lexer);
  lexer_free(lexer);

  value_t sexps = x_make_list();
  while (true) {
    ignore_line_comments(tokens);
    if (list_is_empty(tokens)) {
      break;
    }

    x_list_push_mut(for_sexp(tokens), sexps);
  }

  list_free(tokens);
  return sexps;
}

static void ignore_line_comments(list_t *tokens) {
  while (!list_is_empty(tokens)) {
    token_t *token = list_first(tokens);
    if (token->kind == LINE_COMMENT_TOKEN) {
      list_pop_front(tokens);
      token_free(token);
    } else {
      return;
    }
  }
}

// - assume a sexp exists (maybe after line comments)

static value_t for_sexp(list_t *tokens) {
  if (list_is_empty(tokens)) {
    who_printf("unexpected end of tokens\n");
    exit(1);
  }

  token_t *token = list_pop_front(tokens);
  switch (token->kind) {
  case SYMBOL_TOKEN: {
    value_t sexp = x_object(intern_symbol(token->content));
    token_free(token);
    return sexp;
  }

  case KEYWORD_TOKEN: {
    value_t sexp = x_object(intern_keyword(token->content));
    token_free(token);
    return sexp;
  }

  case STRING_TOKEN: {
    value_t sexp = x_object(make_static_xstring(token->content));
    token_free(token);
    return sexp;
  }

  case INT_TOKEN: {
    value_t sexp = x_int(string_parse_int(token->content));
    token_free(token);
    return sexp;
  }

  case FLOAT_TOKEN: {
    value_t sexp = x_float(string_parse_double(token->content));
    token_free(token);
    return sexp;
  }

  case QUOTATION_MARK_TOKEN: {
    value_t sexp = x_make_list();
    value_t head = x_void;
    if (string_equal(token->content, "'")) {
      head = x_object(intern_symbol("@quote"));
    } else if (string_equal(token->content, "`")) {
      head = x_object(intern_symbol("@quasiquote"));
    } else if (string_equal(token->content, ",")) {
      head = x_object(intern_symbol("@unquote"));
    } else {
      who_printf("unexpected quotation mark: %s\n", token->content);
      exit(1);
    }

    x_list_push_mut(head, sexp);
    x_list_push_mut(for_sexp(tokens), sexp);
    token_free(token);
    return sexp;
  }

  case BRACKET_START_TOKEN: {
    if (string_equal(token->content, "(")) {
      token_free(token);
      return for_list(")", tokens);
    } else if (string_equal(token->content, "[")) {
      token_free(token);
      return x_cons(x_object(intern_symbol("@list")), for_list("]", tokens));
    } else if (string_equal(token->content, "{")) {
      token_free(token);
      return x_cons(x_object(intern_symbol("@record")), for_list("}", tokens));
    } else {
      who_printf("unexpected bracket start: %s\n", token->content);
      exit(1);
    }
  }

  case BRACKET_END_TOKEN: {
    who_printf("unexpected bracket end: %s\n", token->content);
    exit(1);
  }

  case LINE_COMMENT_TOKEN: {
    token_free(token);
    return for_sexp(tokens);
  }
  }

  unreachable();
}

static value_t for_list(const char *end, list_t *tokens) {
  value_t sexp = x_make_list();
  while (true) {
    ignore_line_comments(tokens);
    if (list_is_empty(tokens)) {
      who_printf("unexpected end of tokens\n");
      exit(1);
    }

    token_t *token = list_first(tokens);
    if (token->kind == BRACKET_END_TOKEN) {
      if (string_equal(token->content, end)) {
        token = list_pop_front(tokens);
        token_free(token);
        return sexp;
      } else {
        who_printf(
          "bracket end mismatch, expecting: %s, meet: %s\n",
          end, token->content);
        exit(1);
      }
    } else {
      x_list_push_mut(for_sexp(tokens), sexp);
    }
  }
}

bool sexp_has_tag(value_t sexp, const char *tag) {
  return xlist_p(sexp)
    && false_p(x_list_empty_p(sexp))
    && equal_p(x_car(sexp), x_object(intern_symbol(tag)));
}

// void format_sexp(buffer_t *buffer, value_t sexp)
