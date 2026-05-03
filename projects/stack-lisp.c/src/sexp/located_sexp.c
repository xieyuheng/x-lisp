#include "index.h"

static void ignore_line_comments(list_t *tokens);

static value_t for_sexp(value_t path, list_t *tokens);
static value_t for_elements(value_t path, const char *end, list_t *tokens);

value_t parse_located_sexps(const char *pathname, const char *string) {
  lexer_t *lexer = make_lexer(string);
  lexer->line_comment_introducer = ";";
  list_t *tokens = lexer_lex(lexer);
  lexer_free(lexer);

  value_t path = x_object(make_xstring(pathname));
  value_t sexps = x_make_list();
  while (true) {
    ignore_line_comments(tokens);
    if (list_is_empty(tokens)) {
      break;
    }

    x_list_push_mut(for_sexp(path, tokens), sexps);
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

static value_t symbol_sexp(value_t content, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("symbol-sexp"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(content, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t keyword_sexp(value_t content, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("keyword-sexp"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(content, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t string_sexp(value_t content, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("string-sexp"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(content, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t int_sexp(value_t content, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("int-sexp"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(content, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t float_sexp(value_t content, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("float-sexp"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(content, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t list_sexp(value_t elements, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("list-sexp"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(elements, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t make_source_location_sexp(value_t path, value_t span) {
  xrecord_t *record = make_xrecord();
  xrecord_put(record, "path", path);
  xrecord_put(record, "span", span);
  return x_object(record);
}

// - assume a sexp exists (maybe after line comments)

static value_t for_sexp(value_t path, list_t *tokens) {
  if (list_is_empty(tokens)) {
    who_printf("unexpected end of tokens");
    exit(1);
  }

  token_t *token = list_pop_front(tokens);
  switch (token->kind) {
  case SYMBOL_TOKEN: {
    value_t content = x_object(intern_symbol(token->content));
    value_t span = value_from_span(token->span);
    value_t location = make_source_location_sexp(path, span);
    token_free(token);
    return symbol_sexp(content, location);
  }

  case KEYWORD_TOKEN: {
    value_t content = x_object(intern_keyword(token->content));
    value_t span = value_from_span(token->span);
    value_t location = make_source_location_sexp(path, span);
    token_free(token);
    return keyword_sexp(content, location);
  }

  case STRING_TOKEN: {
    value_t content = x_object(make_xstring_take(string_copy(token->content)));
    value_t span = value_from_span(token->span);
    value_t location = make_source_location_sexp(path, span);
    token_free(token);
    return string_sexp(content, location);
  }

  case INT_TOKEN: {
    value_t content = x_int(string_parse_int(token->content));
    value_t span = value_from_span(token->span);
    value_t location = make_source_location_sexp(path, span);
    token_free(token);
    return int_sexp(content, location);
  }

  case FLOAT_TOKEN: {
    value_t content = x_float(string_parse_double(token->content));
    value_t span = value_from_span(token->span);
    value_t location = make_source_location_sexp(path, span);
    token_free(token);
    return float_sexp(content, location);
  }

  case QUOTATION_MARK_TOKEN: {
    value_t head = x_void;
    value_t span = value_from_span(token->span);
    value_t location = make_source_location_sexp(path, span);
    if (string_equal(token->content, "'")) {
      head = symbol_sexp(x_object(intern_symbol("@quote")), location);
    } else if (string_equal(token->content, "`")) {
      head = symbol_sexp(x_object(intern_symbol("@quasiquote")), location);
    } else if (string_equal(token->content, ",")) {
      head = symbol_sexp(x_object(intern_symbol("@unquote")), location);
    } else {
      who_printf("unexpected quasiquote mark: %s", token->content);
      exit(1);
    }

    value_t elements = x_make_list();
    x_list_push_mut(head, elements);
    x_list_push_mut(for_sexp(path, tokens), elements);
    token_free(token);
    return list_sexp(elements, location);
  }

  case BRACKET_START_TOKEN: {
    if (string_equal(token->content, "(")) {
      value_t span = value_from_span(token->span);
      value_t location = make_source_location_sexp(path, span);
      value_t elements = for_elements(path, ")", tokens);
      token_free(token);
      return list_sexp(elements, location);
    } else if (string_equal(token->content, "[")) {
      value_t span = value_from_span(token->span);
      value_t location = make_source_location_sexp(path, span);
      value_t elements = for_elements(path, "]", tokens);
      value_t content = x_object(intern_symbol("@list"));
      value_t head = symbol_sexp(content, location);
      x_list_push_front_mut(head, elements);
      token_free(token);
      return list_sexp(elements, location);
    } else if (string_equal(token->content, "{")) {
      value_t span = value_from_span(token->span);
      value_t location = make_source_location_sexp(path, span);
      value_t elements = for_elements(path, "}", tokens);
      value_t content = x_object(intern_symbol("@record"));
      value_t head = symbol_sexp(content, location);
      x_list_push_front_mut(head, elements);
      token_free(token);
      return list_sexp(elements, location);
    } else {
      who_printf("unexpected bracket start: %s", token->content);
      exit(1);
    }
  }

  case BRACKET_END_TOKEN: {
    who_printf("unexpected bracket end: %s", token->content);
    exit(1);
  }

  case LINE_COMMENT_TOKEN: {
    token_free(token);
    return for_sexp(path, tokens);
  }
  }

  unreachable();
}

static value_t for_elements(value_t path, const char *end, list_t *tokens) {
  value_t sexp = x_make_list();
  while (true) {
    ignore_line_comments(tokens);
    if (list_is_empty(tokens)) {
      who_printf("unexpected end of tokens");
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
          "bracket end mismatch, expecting: %s, meet: %s",
          end, token->content);
        exit(1);
      }
    } else {
      x_list_push_mut(for_sexp(path, tokens), sexp);
    }
  }
}
