#include "index.h"

static value_t for_sexp(list_t *tokens);
static value_t for_list(const char *end, list_t *tokens);

value_t parse_sexps(const char *string) {
  lexer_t *lexer = make_lexer(string);
  lexer->line_comment_introducer = ";";
  list_t *tokens = lexer_lex(lexer);
  lexer_free(lexer);

  list_builder_t sexps = list_builder_empty();
  while (true) {
    ignore_line_comments(tokens);
    if (list_is_empty(tokens)) {
      break;
    }

    list_builder_append(&sexps, for_sexp(tokens));
  }

  list_free(tokens);
  return list_builder_result(&sexps);
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

  case STRING_TOKEN: {
    value_t sexp = x_object(make_static_xtext(token->content));
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

    value_t sexp = x_cons(head, x_cons(for_sexp(tokens), x_null));
    token_free(token);
    return sexp;
  }

  case BRACKET_START_TOKEN: {
    if (string_equal(token->content, "(")) {
      token_free(token);
      return for_list(")", tokens);
    } else if (string_equal(token->content, "[")) {
      token_free(token);
      return x_cons(x_object(intern_symbol("@square-bracket")), for_list("]", tokens));
    } else if (string_equal(token->content, "{")) {
      token_free(token);
      return x_cons(x_object(intern_symbol("@curly-bracket")), for_list("}", tokens));
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
  list_builder_t result = list_builder_empty();
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
        return list_builder_result(&result);
      } else {
        who_printf(
          "bracket end mismatch, expecting: %s, meet: %s\n",
          end, token->content);
        exit(1);
      }
    } else {
      list_builder_append(&result, for_sexp(tokens));
    }
  }
}

void write_as_sexp(buffer_t *buffer, value_t sexp) {
  if (is_symbol(sexp)) {
    write_string(buffer, symbol_string(to_symbol(sexp)));
    return;
  }

  if (is_atom(sexp)) {
    write_atom(buffer, sexp);
    return;
  }

  if (is_null(sexp)) {
    write_string(buffer, "()");
    return;
  }

  if (is_cons(sexp)) {
    write_string(buffer, "(");
    bool first = true;
    while (is_cons(sexp)) {
      if (!first) write_string(buffer, " ");
      write_as_sexp(buffer, to_cons(sexp)->car);
      first = false;
      sexp = to_cons(sexp)->cdr;
    }
    if (!is_null(sexp)) {
      who_printf("[write_as_sexp] cdr of a list should be a list: ");
      print_value(sexp);
      printf("\n");
      exit(1);
    }
    write_string(buffer, ")");
    return;
  }

  if (is_xset(sexp)) {
    xset_t *xset = to_xset(sexp);
    set_iter_t iter;
    set_iter_init(&iter, xset->set);
    write_string(buffer, "(@set");
    const hash_entry_t *entry = set_iter_next_entry(&iter);
    if (entry) {
      write_as_sexp(buffer, (value_t) entry->value);
      entry = set_iter_next_entry(&iter);
    }

    while (entry) {
      write_string(buffer, " ");
      write_as_sexp(buffer, (value_t) entry->value);
      entry = set_iter_next_entry(&iter);
    }

    write_string(buffer, ")");
    return;
  }

  if (is_xhash(sexp)) {
    xhash_t *xhash = to_xhash(sexp);
    write_string(buffer, "(@hash");
    hash_iter_t iter;
    hash_iter_init(&iter, xhash->hash);
    const hash_entry_t *entry = hash_iter_next_entry(&iter);
    if (entry) {
      write_as_sexp(buffer, (value_t) entry->key);
      write_string(buffer, " ");
      write_as_sexp(buffer, (value_t) entry->value);
      entry = hash_iter_next_entry(&iter);
    }

    while (entry) {
      write_string(buffer, " ");
      write_as_sexp(buffer, (value_t) entry->key);
      write_string(buffer, " ");
      write_as_sexp(buffer, (value_t) entry->value);
      entry = hash_iter_next_entry(&iter);
    }

    write_string(buffer, ")");
    return;
  }

  who_printf("non sexp value: "); print_value(sexp); printf("\n");
  exit(1);
}
