#pragma once

xvm_t *make_xvm(mod_t *mod);
void xvm_free(xvm_t *self);

mod_t *xvm_mod(const xvm_t *self);

value_t xvm_pop(xvm_t *xvm);
void xvm_push(xvm_t *xvm, value_t value);
void xvm_swap_many(xvm_t *xvm, size_t m, size_t n);

frame_t *xvm_top_frame(const xvm_t *xvm);
void xvm_drop_frame(xvm_t *xvm);
void xvm_push_frame(xvm_t *xvm, frame_t *frame);
size_t xvm_frame_count(const xvm_t *xvm);

void xvm_execute(xvm_t *xvm);

void xvm_gc_maybe_collect(xvm_t *xvm);

void xvm_push_root(xvm_t *xvm, value_t value);
void xvm_drop_root(xvm_t *xvm);

void xvm_inspect(xvm_t *xvm);
