#include "index.h"

void call_primitive(
  xvm_t *xvm,
  value_t *locals,
  primitive_fn_t fn,
  uint8_t argc,
  const uint16_t *args
) {
  switch (argc) {
  case 0: {
    xvm->result = ((x_fn_0_t *) fn)();
    return;
  }
  case 1: {
    xvm->result = ((x_fn_1_t *) fn)(locals[args[0]]);
    return;
  }
  case 2: {
    xvm->result = ((x_fn_2_t *) fn)(locals[args[0]], locals[args[1]]);
    return;
  }
  case 3: {
    xvm->result = ((x_fn_3_t *) fn)(
      locals[args[0]],
      locals[args[1]],
      locals[args[2]]);
    return;
  }
  case 4: {
    xvm->result = ((x_fn_4_t *) fn)(
      locals[args[0]],
      locals[args[1]],
      locals[args[2]],
      locals[args[3]]);
    return;
  }
  case 5: {
    xvm->result = ((x_fn_5_t *) fn)(
      locals[args[0]],
      locals[args[1]],
      locals[args[2]],
      locals[args[3]],
      locals[args[4]]);
    return;
  }
  case 6: {
    xvm->result = ((x_fn_6_t *) fn)(
      locals[args[0]],
      locals[args[1]],
      locals[args[2]],
      locals[args[3]],
      locals[args[4]],
      locals[args[5]]);
    return;
  }
  }
}

void call_function_now_values(xvm_t *xvm, function_t *fn,
                              uint8_t argc, const uint16_t *args, value_t *locals) {
  value_t saved[argc > 0 ? argc : 1];
  for (size_t i = 0; i < argc; i++) {
    saved[i] = locals[args[i]];
  }

  size_t old_break = xvm->break_depth;
  xvm->break_depth = xvm->frame_count;
  xvm_push_function_frame_with_values(xvm, fn, argc, saved);
  xvm_execute(xvm);
  xvm->break_depth = old_break;
}

void call_function_now(xvm_t *xvm, function_t *fn) {
  size_t old_break = xvm->break_depth;
  xvm->break_depth = xvm->frame_count;
  xvm_push_function_frame(xvm, fn, 0, NULL);
  xvm_execute(xvm);
  xvm->break_depth = old_break;
}
