#include "index.h"

value_t x_assert(value_t value) {
  if (value != x_true) {
    printf("(assert) fail");
    printf("\n  value: "); 
    print_value(value);
    printf("\n");
    exit(1);
  }

  return x_void;
}

value_t x_assert_not(value_t value) {
  if (value != x_false) {
    printf("(assert-not) fail");
    printf("\n  value: "); 
    print_value(value);
    printf("\n");
    exit(1);
  }

  return x_void;
}

value_t x_assert_equal(value_t lhs, value_t rhs) {
  if (!equal_p(lhs, rhs)) {
    printf("(assert-equal) fail");
    printf("\n  lhs: "); print_value(lhs);
    printf("\n  rhs: "); print_value(rhs);
    printf("\n");
    exit(1);
  }

  return x_void;
}

value_t x_assert_not_equal(value_t lhs, value_t rhs) {
  if (equal_p(lhs, rhs)) {
    printf("(assert-not-equal) fail");
    printf("\n  lhs: "); print_value(lhs);
    printf("\n  rhs: "); print_value(rhs);
    printf("\n");
    exit(1);
  }

  return x_void;
}

value_t x_assert_with_location(value_t value, value_t location) {
  if (value != x_true) {
    printf("(assert) fail");
    printf("\n  value: "); print_value(value);
    printf("\n");
    x_println(location);
    exit(1);
  }

  return x_void;
}

value_t x_assert_not_with_location(value_t value, value_t location) {
  if (value != x_false) {
    printf("(assert-not) fail");
    printf("\n  value: "); 
    print_value(value);
    printf("\n");
    x_println(location);
    exit(1);
  }

  return x_void;
}

value_t x_assert_equal_with_location(value_t lhs, value_t rhs, value_t location) {
  if (!equal_p(lhs, rhs)) {
    printf("(assert-equal) fail");
    printf("\n  lhs: "); print_value(lhs);
    printf("\n  rhs: "); print_value(rhs);
    printf("\n");
    x_println(location);
    exit(1);
  }

  return x_void;
}

value_t x_assert_not_equal_with_location(value_t lhs, value_t rhs, value_t location) {
  if (equal_p(lhs, rhs)) {
    printf("(assert-not-equal) fail");
    printf("\n  lhs: "); print_value(lhs);
    printf("\n  rhs: "); print_value(rhs);
    printf("\n");
    x_println(location);
    exit(1);
  }

  return x_void;
}
