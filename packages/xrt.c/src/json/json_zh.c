#include "index.h"

// ── Chinese constructors ──

static value_t make_json_null_zh(void) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("空结森")));
  return v;
}

static value_t make_json_bool_zh(bool b) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("真假结森")));
  xlist_push(to_xlist(v), x_bool(b));
  return v;
}

static value_t make_json_number_zh(double x) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("数字结森")));
  xlist_push(to_xlist(v), x_float(x));
  return v;
}

static value_t make_json_string_zh(const char *s) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("文本结森")));
  xlist_push(to_xlist(v), x_object(make_static_xtext(s)));
  return v;
}

static value_t make_json_array_zh(void) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("数组结森")));
  xlist_push(to_xlist(v), x_object(make_xlist()));
  return v;
}

static value_t make_json_object_zh(void) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("对象结森")));
  xlist_push(to_xlist(v), x_object(make_xhash()));
  return v;
}

// ── Chinese JSON parser ──

static value_t parse_value_zh(list_t *tokens);
static value_t parse_array_zh(list_t *tokens);
static value_t parse_object_zh(list_t *tokens);

value_t parse_json_zh(const char *string) {
  lexer_t *lexer = make_lexer(string);
  list_t *tokens = lexer_lex(lexer);
  lexer_free(lexer);

  if (list_is_empty(tokens)) {
    list_free(tokens);
    who_printf("empty JSON input\n");
    exit(1);
  }

  value_t result = parse_value_zh(tokens);

  if (!list_is_empty(tokens)) {
    who_printf("trailing token after JSON value\n");
    exit(1);
  }

  list_free(tokens);
  return result;
}

static value_t parse_value_zh(list_t *tokens) {
  token_t *token = pop_token(tokens);

  switch (token->kind) {
  case STRING_TOKEN: {
    value_t result = make_json_string_zh(token->content);
    token_free(token);
    return result;
  }

  case INT_TOKEN: {
    value_t result = make_json_number_zh((double)string_parse_int(token->content));
    token_free(token);
    return result;
  }

  case FLOAT_TOKEN: {
    value_t result = make_json_number_zh(string_parse_double(token->content));
    token_free(token);
    return result;
  }

  case SYMBOL_TOKEN: {
    if (string_equal(token->content, "null")) {
      token_free(token);
      return make_json_null_zh();
    } else if (string_equal(token->content, "true")) {
      token_free(token);
      return make_json_bool_zh(true);
    } else if (string_equal(token->content, "false")) {
      token_free(token);
      return make_json_bool_zh(false);
    } else if (string_equal(token->content, ":")) {
      who_printf("unexpected colon in JSON value position\n");
      exit(1);
    } else {
      who_printf("unexpected symbol in JSON: %s\n", token->content);
      exit(1);
    }
  }

  case BRACKET_START_TOKEN: {
    if (string_equal(token->content, "[")) {
      token_free(token);
      return parse_array_zh(tokens);
    } else if (string_equal(token->content, "{")) {
      token_free(token);
      return parse_object_zh(tokens);
    } else {
      who_printf("unexpected bracket start: %s\n", token->content);
      exit(1);
    }
  }

  case LINE_COMMENT_TOKEN: {
    who_printf("JSON does not support comments\n");
    exit(1);
  }

  default: {
    who_printf("unexpected JSON token: %s\n", token->content);
    exit(1);
  }
  }

  unreachable();
}

static value_t parse_array_zh(list_t *tokens) {
  value_t array = make_json_array_zh();

  if (peek_is_token(tokens, BRACKET_END_TOKEN, "]")) {
    pop_token(tokens); // eat ']'
    return array;
  }

  while (true) {
    json_array_push(array, parse_value_zh(tokens));

    token_t *t = pop_token(tokens);
    if (t->kind == BRACKET_END_TOKEN && string_equal(t->content, "]")) {
      token_free(t);
      return array;
    } else if (t->kind == QUOTATION_MARK_TOKEN && string_equal(t->content, ",")) {
      token_free(t);
    } else {
      who_printf("expected ',' or ']' in JSON array, got: %s\n", t->content);
      exit(1);
    }
  }
}

static value_t parse_object_zh(list_t *tokens) {
  value_t object = make_json_object_zh();

  if (peek_is_token(tokens, BRACKET_END_TOKEN, "}")) {
    pop_token(tokens); // eat '}'
    return object;
  }

  while (true) {
    token_t *key_token = pop_token(tokens);
    if (key_token->kind != STRING_TOKEN) {
      who_printf("object key must be a string, got: %s\n", key_token->content);
      exit(1);
    }

    token_t *colon = pop_token(tokens);
    if (!(colon->kind == SYMBOL_TOKEN && string_equal(colon->content, ":"))) {
      who_printf("expected ':' after object key, got: %s\n", colon->content);
      exit(1);
    }
    token_free(colon);

    json_object_put(object, key_token->content, parse_value_zh(tokens));
    token_free(key_token);

    token_t *t = pop_token(tokens);
    if (t->kind == BRACKET_END_TOKEN && string_equal(t->content, "}")) {
      token_free(t);
      return object;
    } else if (t->kind == QUOTATION_MARK_TOKEN && string_equal(t->content, ",")) {
      token_free(t);
    } else {
      who_printf("expected ',' or '}' in JSON object, got: %s\n", t->content);
      exit(1);
    }
  }
}

// ── Chinese JSON formatter ──

static void write_json_value_zh(buffer_t *buffer, value_t json);

void write_json_zh(buffer_t *buffer, value_t json) {
  write_json_value_zh(buffer, json);
}

static void write_json_value_zh(buffer_t *buffer, value_t json) {
  assert(is_xlist(json));
  xlist_t *xs = to_xlist(json);
  assert(!array_is_empty(xs->elements));

  value_t tag_value = xlist_get(xs, 0);
  assert(is_symbol(tag_value));
  const char *tag = symbol_string(to_symbol(tag_value));

  if (string_equal(tag, "空结森")) {
    write_string(buffer, "null");
  } else if (string_equal(tag, "真假结森")) {
    value_t b = xlist_get(xs, 1);
    write_string(buffer, is_true(b) ? "true" : "false");
  } else if (string_equal(tag, "数字结森")) {
    value_t n = xlist_get(xs, 1);
    if (is_float(n)) {
      write_atom(buffer, n);
    } else {
      write_template(buffer, "%ld", to_int64(n));
    }
  } else if (string_equal(tag, "文本结森")) {
    value_t s = xlist_get(xs, 1);
    write_json_string_escaped(buffer, xtext_string(to_xtext(s)));
  } else if (string_equal(tag, "数组结森")) {
    write_string(buffer, "[");
    value_t elements = xlist_get(xs, 1);
    xlist_t *elems = to_xlist(elements);
    for (size_t i = 0; i < array_length(elems->elements); i++) {
      if (i > 0) write_string(buffer, ", ");
      write_json_value_zh(buffer, xlist_get(elems, i));
    }
    write_string(buffer, "]");
  } else if (string_equal(tag, "对象结森")) {
    write_string(buffer, "{");
    value_t entries = xlist_get(xs, 1);
    xhash_t *hash = to_xhash(entries);
    hash_iter_t iter;
    hash_iter_init(&iter, hash->hash);
    const hash_entry_t *entry = hash_iter_next_entry(&iter);
    bool first = true;
    while (entry) {
      if (!first) write_string(buffer, ", ");
      first = false;
      write_json_string_escaped(buffer, xtext_string(to_xtext((value_t)(uint64_t)entry->key)));
      write_string(buffer, ": ");
      write_json_value_zh(buffer, (value_t)(uint64_t)entry->value);
      entry = hash_iter_next_entry(&iter);
    }
    write_string(buffer, "}");
  } else {
    who_printf("write_json_value_zh: unknown tag: %s\n", tag);
    exit(1);
  }
}
