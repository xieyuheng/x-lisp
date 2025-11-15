#pragma once

#define x_true                                  \
    ((value_t)                                  \
     (X_LITTLE                                  \
      | (((uint64_t) '#') << (7 * 8))           \
      | (((uint64_t) 't') << (6 * 8))))

#define x_false                                 \
    ((value_t)                                  \
     (X_LITTLE                                  \
      | (((uint64_t) '#') << (7 * 8))           \
      | (((uint64_t) 'f') << (6 * 8))))

value_t x_bool(bool target);
bool bool_p(value_t value);
bool to_bool(value_t value);

value_t x_bool_p(value_t x);
value_t x_not(value_t x);
