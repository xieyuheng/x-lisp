#pragma once

struct xvm_t {
  mod_t *mod;
  value_t result;
  buffer_t *frame_buffer;
  size_t frame_offset;
  size_t frame_count;
  size_t break_depth;
  stack_t *root_stack;
};

xvm_t *make_xvm(mod_t *mod);
void xvm_free(xvm_t *self);

mod_t *xvm_mod(const xvm_t *self);
value_t xvm_result(const xvm_t *self);

void xvm_push_function_frame(xvm_t *xvm, const function_t *fn,
                             uint8_t argc, const uint16_t *args);
void xvm_push_function_frame_with_values(xvm_t *xvm, const function_t *fn,
                                          size_t argc, value_t *values);
void xvm_pop_frame(xvm_t *xvm);
size_t xvm_frame_count(const xvm_t *xvm);

void xvm_execute(xvm_t *xvm);

void xvm_gc_maybe_collect(xvm_t *xvm);

void xvm_push_root(xvm_t *xvm, value_t value);
void xvm_drop_root(xvm_t *xvm);

void xvm_inspect(xvm_t *xvm);

frame_t *xvm_current_frame(xvm_t *xvm);
