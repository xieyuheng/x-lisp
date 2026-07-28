#include "index.h"

extern void write_string_escaped(buffer_t *buffer, const char *s);

inline tag_t value_tag(value_t value) {
  return (size_t) value & TAG_MASK;
}

bool is_atom(value_t value) {
  return is_int(value) ||
    is_float(value) ||
    is_xstring(value) ||
    is_symbol(value) ||
    is_keyword(value) ||
    is_bool(value) ||
    is_void(value);
}

bool same(value_t lhs, value_t rhs) {
  return lhs == rhs;
}

bool equal(value_t lhs, value_t rhs) {
  if (same(lhs, rhs)) return true;

  if (is_object(lhs)
    && is_object(rhs)
    && to_object(lhs)->header.class == to_object(rhs)->header.class
    && to_object(lhs)->header.class->equal_fn != NULL) {
    return to_object(lhs)->header.class->equal_fn(to_object(lhs), to_object(rhs));
  }

  return false;
}

hash_code_t value_hash_code(value_t value) {
  if (is_int(value)) {
    return value;
  }

  if (is_float(value)) {
    return value;
  }

  if (is_object(value)) {
    object_t *object = to_object(value);
    if (object->header.class->hash_code_fn) {
      return object->header.class->hash_code_fn(object);
    } else {
      who_printf("unhandled object: "); print_value(value); printf("\n");
      exit(1);
    }
  }

  if (is_immediate(value)) {
    return value;
  }

  who_printf("unhandled value: "); print_value(value); printf("\n");
  exit(1);
}

ordering_t value_total_compare(value_t lhs, value_t rhs) {
  if (same(lhs, rhs)) return 0;

  if (value_tag(lhs) != value_tag(rhs)) {
    return value_tag(lhs) - value_tag(rhs);
  }

  if (is_int(lhs) && is_int(rhs)) {
    return to_int64(lhs) - to_int64(rhs);
  }

  if (is_float(lhs) && is_float(rhs)) {
    return to_double(lhs) - to_double(rhs);
  }

  if (is_object(lhs) && is_object(rhs)) {
    if (to_object(lhs)->header.class != to_object(rhs)->header.class) {
      return string_compare_lexical(
        to_object(lhs)->header.class->name,
        to_object(rhs)->header.class->name);
    }

    object_compare_fn_t *compare_fn =
      to_object(lhs)->header.class->compare_fn;
    if (compare_fn) {
      return compare_fn(to_object(lhs), to_object(rhs));
    } else {
      who_printf("unhandled objects\n");
      printf("  lhs: "); print_value(lhs); printf("\n");
      printf("  rhs: "); print_value(rhs); printf("\n");
    }
  }

  if (is_immediate(lhs) && is_immediate(rhs)) {
    return (int64_t) (lhs - rhs);
  }

  who_printf("unhandled values\n");
  printf("  lhs: "); print_value(lhs); printf("\n");
  printf("  rhs: "); print_value(rhs); printf("\n");
  exit(1);
}

void write_atom(buffer_t *buffer, value_t value) {
  assert(is_atom(value));

  if (is_int(value)) {
    write_template(buffer, "%ld", to_int64(value));
    return;
  }

  if (is_float(value)) {
    char string[64];
    sprintf(string, "%.17g", to_double(value));
    if (!string_has_char(string, '.')) {
      size_t end = string_length(string);
      string[end] = '.';
      string[end + 1] = '0';
      string[end + 2] = '\0';
    }

    write_string(buffer, string);
    return;
  }

  if (is_xstring(value)) {
    write_string(buffer, "\"");
    write_string_escaped(buffer, xstring_string(to_xstring(value)));
    write_string(buffer, "\"");
    return;
  }

  if (is_symbol(value)) {
    write_string(buffer, "'");
    write_string(buffer, symbol_string(to_symbol(value)));
    return;
  }

  if (is_keyword(value)) {
    write_string(buffer, ":");
    write_string(buffer, keyword_string(to_keyword(value)));
    return;
  }

  if (is_true(value)) {
    write_string(buffer, "#t");
    return;
  }

  if (is_false(value)) {
    write_string(buffer, "#f");
    return;
  }

  if (is_void(value)) {
    write_string(buffer, "#void");
    return;
  }
}

void value_format(buffer_t *buffer, object_circle_ctx_t *ctx, value_t value) {
  if (is_atom(value)) {
    write_atom(buffer, value);
    return;
  }

  if (is_object(value)) {
    object_t *object = to_object(value);
    if (is_object_circle_start(ctx, object)) {
      write_template(buffer, "#%ld=", object_circle_index(ctx, object));
      object_circle_meet(ctx, object);
      object_format(buffer, ctx, object);
      return;
    } else if (is_object_circle_end(ctx, object)) {
      write_template(buffer, "#%ld#", object_circle_index(ctx, object));
      return;
    } else {
      object_format(buffer, ctx, object);
      return;
    }
  }

  write_template(buffer, "#(unknown-value 0x%lx)", value);
  return;
}

void write_value(buffer_t *buffer, value_t value) {
  object_circle_ctx_t *ctx = make_object_circle_ctx();
  if (is_object(value)) {
    object_circle_collect(ctx, to_object(value));
    set_clear(ctx->occurred_objects);
  }

  value_format(buffer, ctx, value);
  object_circle_ctx_free(ctx);
}

void print_value(value_t value) {
  buffer_t *buffer = make_buffer();
  write_value(buffer, value);
  buffer_write(buffer, stdout);
  buffer_free(buffer);
}
