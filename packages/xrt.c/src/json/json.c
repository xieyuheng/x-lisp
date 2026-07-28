#include "index.h"

static value_t parse_value(list_t *tokens);
static value_t parse_array(list_t *tokens);
static value_t parse_object(list_t *tokens);

// constructors

value_t make_json_null(void) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("json-null")));
  return v;
}

value_t make_json_bool(bool b) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("json-bool")));
  xlist_push(to_xlist(v), x_bool(b));
  return v;
}

value_t make_json_number(double x) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("json-number")));
  xlist_push(to_xlist(v), x_float(x));
  return v;
}

value_t make_json_string(const char *s) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("json-string")));
  xlist_push(to_xlist(v), x_object(make_static_xstring(s)));
  return v;
}

value_t make_json_array(void) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("json-array")));
  xlist_push(to_xlist(v), x_object(make_xlist()));
  return v;
}

void json_array_push(value_t array, value_t element) {
  xlist_t *xs = to_xlist(array);
  xlist_t *elements = to_xlist(xlist_get(xs, 1));
  xlist_push(elements, element);
}

value_t make_json_object(void) {
  value_t v = x_object(make_xlist());
  xlist_push(to_xlist(v), x_object(intern_symbol("json-object")));
  xlist_push(to_xlist(v), x_object(make_xhash()));
  return v;
}

void json_object_put(value_t object, const char *key, value_t value) {
  xlist_t *xs = to_xlist(object);
  xhash_t *hash = to_xhash(xlist_get(xs, 1));
  xhash_put(hash, x_object(make_static_xstring(key)), value);
}

// ── JSON parser ──

value_t parse_json(const char *string) {
  lexer_t *lexer = make_lexer(string);
  list_t *tokens = lexer_lex(lexer);
  lexer_free(lexer);

  if (list_is_empty(tokens)) {
    list_free(tokens);
    who_printf("empty JSON input\n");
    exit(1);
  }

  value_t result = parse_value(tokens);

  if (!list_is_empty(tokens)) {
    who_printf("trailing token after JSON value\n");
    exit(1);
  }

  list_free(tokens);
  return result;
}

// ── token helpers ──

static token_t *pop_token(list_t *tokens) {
  if (list_is_empty(tokens)) {
    who_printf("unexpected end of JSON input\n");
    exit(1);
  }
  return list_pop_front(tokens);
}

static bool peek_is_token(list_t *tokens, token_kind_t kind, const char *content) {
  if (list_is_empty(tokens)) return false;
  token_t *t = list_first(tokens);
  return t->kind == kind && string_equal(t->content, content);
}

// ── recursive descent ──

static value_t parse_value(list_t *tokens) {
  token_t *token = pop_token(tokens);

  switch (token->kind) {
  case STRING_TOKEN: {
    value_t result = make_json_string(token->content);
    token_free(token);
    return result;
  }

  case INT_TOKEN: {
    value_t result = make_json_number((double)string_parse_int(token->content));
    token_free(token);
    return result;
  }

  case FLOAT_TOKEN: {
    value_t result = make_json_number(string_parse_double(token->content));
    token_free(token);
    return result;
  }

  case SYMBOL_TOKEN: {
    if (string_equal(token->content, "null")) {
      token_free(token);
      return make_json_null();
    } else if (string_equal(token->content, "true")) {
      token_free(token);
      return make_json_bool(true);
    } else if (string_equal(token->content, "false")) {
      token_free(token);
      return make_json_bool(false);
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
      return parse_array(tokens);
    } else if (string_equal(token->content, "{")) {
      token_free(token);
      return parse_object(tokens);
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

static value_t parse_array(list_t *tokens) {
  value_t array = make_json_array();

  if (peek_is_token(tokens, BRACKET_END_TOKEN, "]")) {
    pop_token(tokens); // eat ']'
    return array;
  }

  while (true) {
    json_array_push(array, parse_value(tokens));

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

static value_t parse_object(list_t *tokens) {
  value_t object = make_json_object();

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

    json_object_put(object, key_token->content, parse_value(tokens));
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

// ── JSON formatter ──

static void write_json_value(buffer_t *buffer, value_t json);

void write_string_escaped(buffer_t *buffer, const char *s) {
  size_t i = 0;
  while (s[i]) {
    switch (s[i]) {
    case '"':  write_string(buffer, "\\\""); break;
    case '\\': write_string(buffer, "\\\\"); break;
    case '\n': write_string(buffer, "\\n");  break;
    case '\r': write_string(buffer, "\\r");  break;
    case '\t': write_string(buffer, "\\t");  break;
    default:   write_char(buffer, s[i]);     break;
    }
    i++;
  }
}

static void write_json_string_escaped(buffer_t *buffer, const char *s) {
  write_string(buffer, "\"");
  write_string_escaped(buffer, s);
  write_string(buffer, "\"");
}

void write_json(buffer_t *buffer, value_t json) {
  write_json_value(buffer, json);
}

static void write_json_value(buffer_t *buffer, value_t json) {
  assert(is_xlist(json));
  xlist_t *xs = to_xlist(json);
  assert(!array_is_empty(xs->elements));

  value_t tag_value = xlist_get(xs, 0);
  assert(is_symbol(tag_value));
  const char *tag = symbol_string(to_symbol(tag_value));

  if (string_equal(tag, "json-null")) {
    write_string(buffer, "null");
  } else if (string_equal(tag, "json-bool")) {
    value_t b = xlist_get(xs, 1);
    write_string(buffer, is_true(b) ? "true" : "false");
  } else if (string_equal(tag, "json-number")) {
    value_t n = xlist_get(xs, 1);
    if (is_float(n)) {
      write_atom(buffer, n);
    } else {
      write_template(buffer, "%ld", to_int64(n));
    }
  } else if (string_equal(tag, "json-string")) {
    value_t s = xlist_get(xs, 1);
    write_json_string_escaped(buffer, xstring_string(to_xstring(s)));
  } else if (string_equal(tag, "json-array")) {
    write_string(buffer, "[");
    value_t elements = xlist_get(xs, 1);
    xlist_t *elems = to_xlist(elements);
    for (size_t i = 0; i < array_length(elems->elements); i++) {
      if (i > 0) write_string(buffer, ", ");
      write_json_value(buffer, xlist_get(elems, i));
    }
    write_string(buffer, "]");
  } else if (string_equal(tag, "json-object")) {
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
      write_json_string_escaped(buffer, xstring_string(to_xstring((value_t)(uint64_t)entry->key)));
      write_string(buffer, ": ");
      write_json_value(buffer, (value_t)(uint64_t)entry->value);
      entry = hash_iter_next_entry(&iter);
    }
    write_string(buffer, "}");
  } else {
    who_printf("write_json_value: unknown tag: %s\n", tag);
    exit(1);
  }
}
