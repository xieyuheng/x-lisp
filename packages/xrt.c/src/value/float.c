#include "index.h"

// double-precision floating-point but truncate the lower 3 bits

typedef union { double as_double; uint64_t as_uint64; } double_or_uint64_t;

inline value_t x_float(double target) {
  double_or_uint64_t the_union = (double_or_uint64_t) {
    .as_double = target
  };

  return (the_union.as_uint64 & PAYLOAD_MASK) | X_FLOAT;
}

inline bool is_float(value_t value) {
  return value_tag(value) == X_FLOAT;
}

inline double to_double(value_t value) {
  assert(is_float(value));

  double_or_uint64_t the_union = (double_or_uint64_t) {
    .as_uint64 = ((uint64_t) value) & PAYLOAD_MASK
  };

  return the_union.as_double;
}

inline value_t x_is_float(value_t value) {
  return x_bool(is_float(value));
}

inline value_t x_fneg(value_t x) {
  return x_float(-to_double(x));
}

inline value_t x_fadd(value_t x, value_t y) {
  return x_float(to_double(x) + to_double(y));
}

inline value_t x_fsub(value_t x, value_t y) {
  return x_float(to_double(x) - to_double(y));
}

inline value_t x_fmul(value_t x, value_t y) {
  return x_float(to_double(x) * to_double(y));
}

inline value_t x_fdiv(value_t x, value_t y) {
  return x_float(to_double(x) / to_double(y));
}

inline value_t x_fmod(value_t x, value_t y) {
  return x_float(fmod(to_double(x), to_double(y)));
}

value_t x_float_max(value_t x, value_t y) {
  return x_float(fmax(to_double(x), to_double(y)));
}

value_t x_float_min(value_t x, value_t y) {
  return x_float(fmin(to_double(x), to_double(y)));
}

value_t x_float_greater(value_t x, value_t y) {
  return x_bool(to_double(x) > to_double(y));
}

value_t x_float_less(value_t x, value_t y) {
  return x_bool(to_double(x) < to_double(y));
}

value_t x_float_greater_or_equal(value_t x, value_t y) {
  return x_bool(to_double(x) >= to_double(y));
}

value_t x_float_less_or_equal(value_t x, value_t y) {
  return x_bool(to_double(x) <= to_double(y));
}

value_t x_float_positive(value_t x) {
  return x_bool(to_double(x) > 0);
}

value_t x_float_non_negative(value_t x) {
  return x_bool(to_double(x) >= 0);
}

value_t x_float_non_zero(value_t x) {
  return x_bool(to_double(x) != 0);
}

value_t x_float_compare_ascending(value_t x, value_t y) {
  if (to_double(x) < to_double(y)) {
    return x_int(-1);
  } else if (to_double(x) > to_double(y)) {
    return x_int(1);
  } else {
    return x_int(0);
  }
}

value_t x_float_compare_descending(value_t x, value_t y) {
  if (to_double(x) < to_double(y)) {
    return x_int(1);
  } else if (to_double(x) > to_double(y)) {
    return x_int(-1);
  } else {
    return x_int(0);
  }
}

inline value_t x_float_to_int(value_t x) {
  if (!x_is_float(x)) {
    who_printf("type mismatch\n");
    exit(1);
  }

  return x_int((uint64_t) to_double(x));
}
