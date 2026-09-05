#pragma once

struct xvm_t {
  program_t *program;
  value_t result;
  uint8_t *frame_bytes;
  size_t frame_capacity;
  size_t frame_offset;
  size_t frame_top;
  size_t frame_count;
  size_t break_depth;
  stack_t *root_stack;
};

xvm_t *make_xvm(program_t *program);
void xvm_free(xvm_t *self);

program_t *xvm_program(const xvm_t *self);
value_t xvm_result(const xvm_t *self);

void xvm_push_function_frame(xvm_t *xvm, function_t *fn,
                             uint8_t argc, const uint16_t *args);
void xvm_push_function_frame_with_values(xvm_t *xvm, function_t *fn,
                                          size_t argc, value_t *values);
void xvm_pop_frame(xvm_t *xvm);
size_t xvm_frame_count(const xvm_t *xvm);

void xvm_execute(xvm_t *xvm);

void program_build_threaded_codes(program_t *program);

void xvm_gc_maybe_collect(xvm_t *xvm);

void xvm_push_root(xvm_t *xvm, value_t value);
void xvm_drop_root(xvm_t *xvm);

void xvm_inspect(xvm_t *xvm);

frame_t *xvm_current_frame(xvm_t *xvm);
