#include "index.h"

const object_class_t cons_class = {
  .name = "cons",
  .equal_fn = (object_equal_fn_t *) cons_equal,
  .write_fn = (object_write_fn_t *) write_cons,
  .hash_code_fn = (object_hash_code_fn_t *) cons_hash_code,
  .compare_fn = (object_compare_fn_t *) cons_compare,
  .free_fn = (free_fn_t *) cons_free,
  .for_each_child_fn = (object_for_each_child_fn_t *) cons_for_each_child,
};

cons_t *make_cons(value_t car, value_t cdr) {
  cons_t *self = new(cons_t);
  self->header.class = &cons_class;
  self->car = car;
  self->cdr = cdr;
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

list_builder_t list_builder_empty(void) {
  return (list_builder_t) { .head = x_null, .tail = x_null };
}

void list_builder_append(list_builder_t *self, value_t value) {
  value_t cell = x_object(make_cons(value, x_null));
  if (self->head == x_null) {
    self->head = cell;
  } else {
    cons_t *tail = to_cons(self->tail);
    tail->cdr = cell;
    gc_write_barrier((object_t *) tail, cell);
  }
  self->tail = cell;
}

value_t list_builder_result(const list_builder_t *self) {
  return self->head;
}

void cons_free(cons_t *self) {
  free(self);
}

bool is_cons(value_t value) {
  return is_object(value) &&
    to_object(value)->header.class == &cons_class;
}

cons_t *to_cons(value_t value) {
  assert(is_cons(value));
  return (cons_t *) to_object(value);
}

bool cons_equal(const cons_t *lhs, const cons_t *rhs) {
  if (lhs == rhs) return true;

  while (true) {
    if (!equal(lhs->car, rhs->car)) return false;

    if (is_cons(lhs->cdr) && is_cons(rhs->cdr)) {
      lhs = to_cons(lhs->cdr);
      rhs = to_cons(rhs->cdr);
    } else {
      return equal(lhs->cdr, rhs->cdr);
    }
  }
}

void write_cons(buffer_t *buffer, object_circle_ctx_t *ctx, const cons_t *self) {
  write_template(buffer, ctx->lang == LANG_ZH ? "(@列表" : "(@list");
  const cons_t *cell = self;
  while (true) {
    write_template(buffer, " ");
    write_value_in_ctx(buffer, ctx, cell->car);
    if (is_cons(cell->cdr)) {
      cell = to_cons(cell->cdr);
    } else if (is_null(cell->cdr)) {
      break;
    } else {
      who_printf("(write_cons) cdr of a list should be a list\n");
      exit(1);
    }
  }
  write_template(buffer, ")");
}

hash_code_t cons_hash_code(const cons_t *self) {
  hash_code_t code = 6661; // any big prime number would do.
  const cons_t *cell = self;
  while (true) {
    code = (code << 5) - code + value_hash_code(cell->car);
    if (is_cons(cell->cdr)) {
      cell = to_cons(cell->cdr);
    } else {
      code = (code << 5) - code + value_hash_code(cell->cdr);
      break;
    }
  }
  return code;
}

ordering_t cons_compare(const cons_t *lhs, const cons_t *rhs) {
  if (lhs == rhs) return 0;

  const cons_t *lhs_cell = lhs;
  const cons_t *rhs_cell = rhs;
  while (true) {
    if (is_cons(lhs_cell->cdr) && is_cons(rhs_cell->cdr)) {
      ordering_t ordering = value_total_compare(lhs_cell->car, rhs_cell->car);
      if (ordering != 0) return ordering;
      lhs_cell = to_cons(lhs_cell->cdr);
      rhs_cell = to_cons(rhs_cell->cdr);
    } else {
      return value_total_compare(lhs_cell->cdr, rhs_cell->cdr);
    }
  }
}

void cons_for_each_child(const cons_t *cons,
                         object_visit_child_fn_t *visit, void *ctx) {
  if (is_object(cons->car)) visit(to_object(cons->car), ctx);
  if (is_object(cons->cdr)) visit(to_object(cons->cdr), ctx);
}
