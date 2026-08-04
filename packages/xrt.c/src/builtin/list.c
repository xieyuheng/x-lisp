#include "index.h"

value_t x_make_list(void) {
  return x_object(make_xlist());
}

value_t x_is_any_list(value_t value) {
  return x_bool(is_xlist(value));
}

value_t x_list_copy(value_t list) {
  return x_object(xlist_copy(to_xlist(list)));
}

value_t x_list_length(value_t list) {
  return x_int(array_length(to_xlist(list)->elements));
}

value_t x_list_is_empty(value_t list) {
  return x_bool(array_is_empty(to_xlist(list)->elements));
}

value_t x_list_pop_mut(value_t list) {
  return xlist_pop(to_xlist(list));
}

value_t x_list_push_mut(value_t value, value_t list) {
  xlist_push(to_xlist(list), value);
  return x_void;
}

value_t x_list_pop_front_mut(value_t list) {
  return xlist_pop_front(to_xlist(list));
}

value_t x_list_push_front_mut(value_t value, value_t list) {
  xlist_push_front(to_xlist(list), value);
  return x_void;
}

value_t x_list_get(value_t index, value_t list) {
  return xlist_get(to_xlist(list), to_int64(index));
}

value_t x_list_put_mut(value_t index, value_t value, value_t list) {
  xlist_put(to_xlist(list), to_int64(index), value);
  return x_void;
}

value_t x_list_put(value_t index, value_t value, value_t list) {
  value_t copy = x_list_copy(list);
  xlist_put(to_xlist(copy), to_int64(index), value);
  return copy;
}

value_t x_car(value_t list) {
  return xlist_get(to_xlist(list), 0);
}

value_t x_cdr(value_t list) {
  list = x_list_copy(list);
  x_list_pop_front_mut(list);
  return list;
}

value_t x_cons(value_t head, value_t tail) {
  value_t copy = x_list_copy(tail);
  xlist_push_front(to_xlist(copy), head);
  return copy;
}

value_t x_list_head(value_t list) {
  return x_car(list);
}

value_t x_list_tail(value_t list) {
  return x_cdr(list);
}

value_t x_list_init(value_t list) {
  list = x_list_copy(list);
  x_list_pop_mut(list);
  return list;
}

value_t x_list_last(value_t list) {
  size_t length = array_length(to_xlist(list)->elements);
  return (value_t) array_get(to_xlist(list)->elements, length - 1);
}

value_t x_list_reverse_mut(value_t list) {
  array_reverse(to_xlist(list)->elements);
  return x_void;
}

value_t x_list_reverse(value_t list) {
  value_t copy = x_list_copy(list);
  array_reverse(to_xlist(copy)->elements);
  return copy;
}

value_t x_list_to_set(value_t list) {
  xset_t *set = make_xset();
  size_t length = array_length(to_xlist(list)->elements);
  for (size_t i = 0; i < length; i++) {
    value_t element = xlist_get(to_xlist(list), i);
    xset_add(set, element);
  }

  return x_object(set);
}

// ---------------------------------------------------------------------------
// pair
// ---------------------------------------------------------------------------

value_t x_make_pair(value_t first, value_t second) {
  value_t pair = x_make_list();
  xlist_push(to_xlist(pair), first);
  xlist_push(to_xlist(pair), second);
  return pair;
}

value_t x_pair_first(value_t pair) {
  return xlist_get(to_xlist(pair), 0);
}

value_t x_pair_second(value_t pair) {
  return xlist_get(to_xlist(pair), 1);
}

value_t x_pair_put_first(value_t value, value_t pair) {
  xlist_put(to_xlist(pair), 0, value);
  return pair;
}

value_t x_pair_put_second(value_t value, value_t pair) {
  xlist_put(to_xlist(pair), 1, value);
  return pair;
}
