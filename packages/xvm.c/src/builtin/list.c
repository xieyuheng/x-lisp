#include "index.h"

value_t x_is_any_list(value_t value) {
  return x_bool(is_cons(value) || is_null(value));
}

value_t x_car(value_t list) {
  if (!is_cons(list)) {
    who_printf("(car) of non-list value: ");
    print_value(list);
    printf("\n");
    exit(1);
  }
  return to_cons(list)->car;
}

value_t x_cdr(value_t list) {
  if (!is_cons(list)) {
    who_printf("(cdr) of non-list value: ");
    print_value(list);
    printf("\n");
    exit(1);
  }
  return to_cons(list)->cdr;
}

value_t x_cons(value_t head, value_t tail) {
  return x_object(make_cons(head, tail));
}