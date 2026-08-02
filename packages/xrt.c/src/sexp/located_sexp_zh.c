#include "index.h"

// ── Chinese constructors ──

static value_t symbol_sexp_zh(value_t content, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("符号符号算式"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(content, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t keyword_sexp_zh(value_t content, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("标签符号算式"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(content, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t string_sexp_zh(value_t content, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("文本符号算式"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(content, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t int_sexp_zh(value_t content, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("整数符号算式"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(content, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t float_sexp_zh(value_t content, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("浮点符号算式"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(content, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t list_sexp_zh(value_t elements, value_t location) {
  value_t sexp = x_make_list();
  value_t tag = x_object(intern_symbol("列表符号算式"));
  x_list_push_mut(tag, sexp);
  x_list_push_mut(elements, sexp);
  x_list_push_mut(location, sexp);
  return sexp;
}

static value_t make_source_location_sexp_zh(value_t path, value_t span) {
  value_t data = x_make_list();
  value_t tag = x_object(intern_symbol("作源码位置"));
  x_list_push_mut(tag, data);
  x_list_push_mut(path, data);
  x_list_push_mut(span, data);
  return data;
}

// ── Chinese parser ──

static value_t for_sexp_zh(value_t path, list_t *tokens);
static value_t for_elements_zh(value_t path, const char *end, list_t *tokens,
                               struct span_t *out_end_span);

value_t parse_located_sexps_zh(const char *pathname, const char *string) {
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

    x_list_push_mut(for_sexp_zh(path, tokens), sexps);
  }

  list_free(tokens);
  return sexps;
}

// - assume a sexp exists (maybe after line comments)

static value_t for_sexp_zh(value_t path, list_t *tokens) {
  if (list_is_empty(tokens)) {
    who_printf("unexpected end of tokens");
    exit(1);
  }

  token_t *token = list_pop_front(tokens);
  switch (token->kind) {
  case SYMBOL_TOKEN: {
    value_t content = x_object(intern_symbol(token->content));
    value_t span = value_from_span_zh(token->span);
    value_t location = make_source_location_sexp_zh(path, span);
    token_free(token);
    return symbol_sexp_zh(content, location);
  }

  case KEYWORD_TOKEN: {
    value_t content = x_object(intern_keyword(token->content));
    value_t span = value_from_span_zh(token->span);
    value_t location = make_source_location_sexp_zh(path, span);
    token_free(token);
    return keyword_sexp_zh(content, location);
  }

  case STRING_TOKEN: {
    value_t content = x_object(make_xstring_take(string_copy(token->content)));
    value_t span = value_from_span_zh(token->span);
    value_t location = make_source_location_sexp_zh(path, span);
    token_free(token);
    return string_sexp_zh(content, location);
  }

  case INT_TOKEN: {
    value_t content = x_int(string_parse_int(token->content));
    value_t span = value_from_span_zh(token->span);
    value_t location = make_source_location_sexp_zh(path, span);
    token_free(token);
    return int_sexp_zh(content, location);
  }

  case FLOAT_TOKEN: {
    value_t content = x_float(string_parse_double(token->content));
    value_t span = value_from_span_zh(token->span);
    value_t location = make_source_location_sexp_zh(path, span);
    token_free(token);
    return float_sexp_zh(content, location);
  }

  case QUOTATION_MARK_TOKEN: {
    value_t head = x_void;
    value_t span = value_from_span_zh(token->span);
    value_t location = make_source_location_sexp_zh(path, span);
    if (string_equal(token->content, "'")) {
      head = symbol_sexp_zh(x_object(intern_symbol("@引用")), location);
    } else if (string_equal(token->content, "`")) {
      head = symbol_sexp_zh(x_object(intern_symbol("@半引用")), location);
    } else if (string_equal(token->content, ",")) {
      head = symbol_sexp_zh(x_object(intern_symbol("@去引用")), location);
    } else {
      who_printf("unexpected quasiquote mark: %s", token->content);
      exit(1);
    }

    value_t elements = x_make_list();
    x_list_push_mut(head, elements);
    x_list_push_mut(for_sexp_zh(path, tokens), elements);
    token_free(token);
    return list_sexp_zh(elements, location);
  }

  case BRACKET_START_TOKEN: {
    if (string_equal(token->content, "(")) {
      struct span_t start_span = token->span;
      struct span_t end_span;
      value_t elements = for_elements_zh(path, ")", tokens, &end_span);
      struct span_t span = span_union(start_span, end_span);
      value_t location = make_source_location_sexp_zh(path, value_from_span_zh(span));
      token_free(token);
      return list_sexp_zh(elements, location);
    } else if (string_equal(token->content, "[")) {
      struct span_t start_span = token->span;
      struct span_t end_span;
      value_t elements = for_elements_zh(path, "]", tokens, &end_span);
      struct span_t span = span_union(start_span, end_span);
      value_t location = make_source_location_sexp_zh(path, value_from_span_zh(span));
      value_t content = x_object(intern_symbol("@方括号"));
      value_t head = symbol_sexp_zh(content, location);
      x_list_push_front_mut(head, elements);
      token_free(token);
      return list_sexp_zh(elements, location);
    } else if (string_equal(token->content, "{")) {
      struct span_t start_span = token->span;
      struct span_t end_span;
      value_t elements = for_elements_zh(path, "}", tokens, &end_span);
      struct span_t span = span_union(start_span, end_span);
      value_t location = make_source_location_sexp_zh(path, value_from_span_zh(span));
      value_t content = x_object(intern_symbol("@花括号"));
      value_t head = symbol_sexp_zh(content, location);
      x_list_push_front_mut(head, elements);
      token_free(token);
      return list_sexp_zh(elements, location);
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
    return for_sexp_zh(path, tokens);
  }
  }

  unreachable();
}

static value_t for_elements_zh(value_t path, const char *end, list_t *tokens,
                               struct span_t *out_end_span) {
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
        *out_end_span = token->span;
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
      x_list_push_mut(for_sexp_zh(path, tokens), sexp);
    }
  }
}
