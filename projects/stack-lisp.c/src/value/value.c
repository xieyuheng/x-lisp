#include "index.h"

inline tag_t value_tag(value_t value) {
  return (size_t) value & TAG_MASK;
}

bool atom_p(value_t value) {
  return int_p(value) ||
    float_p(value) ||
    xstring_p(value) ||
    symbol_p(value) ||
    keyword_p(value) ||
    bool_p(value) ||
    void_p(value);
}

bool same_p(value_t lhs, value_t rhs) {
  return lhs == rhs;
}

bool equal_p(value_t lhs, value_t rhs) {
  if (same_p(lhs, rhs)) return true;

  if (object_p(lhs)
    && object_p(rhs)
    && to_object(lhs)->header.class == to_object(rhs)->header.class
    && to_object(lhs)->header.class->equal_fn != NULL) {
    return to_object(lhs)->header.class->equal_fn(to_object(lhs), to_object(rhs));
  }

  return false;
}

hash_code_t value_hash_code(value_t value) {
  if (int_p(value)) {
    return value;
  }

  if (float_p(value)) {
    return value;
  }

  if (object_p(value)) {
    object_t *object = to_object(value);
    if (object->header.class->hash_code_fn) {
      return object->header.class->hash_code_fn(object);
    } else {
      who_printf("unhandled object: "); print_value(value); newline();
      exit(1);
    }
  }

  who_printf("unhandled value: "); print_value(value); newline();
  exit(1);
}

ordering_t value_total_compare(value_t lhs, value_t rhs) {
  if (same_p(lhs, rhs)) return 0;

  if (value_tag(lhs) != value_tag(rhs)) {
    return value_tag(lhs) - value_tag(rhs);
  }

  if (int_p(lhs) && int_p(rhs)) {
    return to_int64(lhs) - to_int64(rhs);
  }

  if (float_p(lhs) && float_p(rhs)) {
    return to_double(lhs) - to_double(rhs);
  }

  if (object_p(lhs) && object_p(rhs)) {
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
      printf("  lhs: "); print_value(lhs); newline();
      printf("  rhs: "); print_value(rhs); newline();
    }
  }

  who_printf("unhandled values\n");
  printf("  lhs: "); print_value(lhs); newline();
  printf("  rhs: "); print_value(rhs); newline();
  exit(1);
}

void value_format(buffer_t *buffer, object_circle_ctx_t *ctx, value_t value) {
  if (int_p(value)) {
    format_template(buffer, "%ld", to_int64(value));
    return;
  }

  if (float_p(value)) {
    char string[64];
    sprintf(string, "%.17g", to_double(value));
    if (!string_has_char(string, '.')) {
      size_t end = string_length(string);
      string[end] = '.';
      string[end + 1] = '0';
      string[end + 2] = '\0';
    }

    format_template(buffer, "%s", string);
    return;
  }

  if (void_p(value)) {
    format_template(buffer, "#void");
    return;
  }

  if (true_p(value)) {
    format_template(buffer, "#t");
    return;
  }

  if (false_p(value)) {
    format_template(buffer, "#f");
    return;
  }

  if (object_p(value)) {
    object_t *object = to_object(value);
    if (object_circle_start_p(ctx, object)) {
      format_template(buffer, "#%ld=", object_circle_index(ctx, object));
      object_circle_meet(ctx, object);
      object_format(buffer, ctx, object);
      return;
    } else if (object_circle_end_p(ctx, object)) {
      format_template(buffer, "#%ld#", object_circle_index(ctx, object));
      return;
    } else {
      object_format(buffer, ctx, object);
      return;
    }
  }

  format_template(buffer, "#(unknown-value 0x%lx)", value);
  return;
}

void format_value(buffer_t *buffer, value_t value) {
  object_circle_ctx_t *ctx = make_object_circle_ctx();
  if (object_p(value)) {
    object_circle_collect(ctx, to_object(value));
    set_clear(ctx->occurred_objects);
  }

  value_format(buffer, ctx, value);
  object_circle_ctx_free(ctx);
}

void print_value(value_t value) {
  buffer_t *buffer = make_buffer();
  format_value(buffer, value);
  buffer_write(buffer, stdout);
  buffer_free(buffer);
}
