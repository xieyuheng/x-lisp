#pragma once

struct xvm_t {
  mod_t *mod;
  value_t result;
  stack_t *frame_stack;
  stack_t *root_stack;
};

xvm_t *make_xvm(mod_t *mod);
void xvm_free(xvm_t *self);

mod_t *xvm_mod(const xvm_t *self);
value_t xvm_result(const xvm_t *self);

frame_t *xvm_top_frame(const xvm_t *xvm);
void xvm_drop_frame(xvm_t *xvm);
void xvm_push_frame(xvm_t *xvm, frame_t *frame);
size_t xvm_frame_count(const xvm_t *xvm);

void xvm_execute(xvm_t *xvm);

void xvm_gc_maybe_collect(xvm_t *xvm);

void xvm_push_root(xvm_t *xvm, value_t value);
void xvm_drop_root(xvm_t *xvm);

void xvm_inspect(xvm_t *xvm);
