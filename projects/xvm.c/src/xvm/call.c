#include "index.h"

void call_primitive(
  xvm_t *xvm,
  value_t *locals,
  const primitive_t *primitive,
  uint8_t argc,
  const uint16_t *args
) {
  (void) argc;
  switch (primitive->fn_kind) {
  case X_FN_0: {
    xvm->result = primitive->fn_0();
    return;
  }
  case X_FN_1: {
    xvm->result = primitive->fn_1(locals[args[0]]);
      return;
  }
  case X_FN_2: {
    xvm->result = primitive->fn_2(locals[args[0]], locals[args[1]]);
    return;
  }
  case X_FN_3: {
    xvm->result = primitive->fn_3(
      locals[args[0]],
      locals[args[1]],
      locals[args[2]]);
    return;
  }
  case X_FN_4: {
    xvm->result = primitive->fn_4(
      locals[args[0]],
      locals[args[1]],
      locals[args[2]],
      locals[args[3]]);
    return;
  }
  case X_FN_5: {
    xvm->result = primitive->fn_5(
      locals[args[0]],
      locals[args[1]],
      locals[args[2]],
      locals[args[3]],
      locals[args[4]]);
    return;
  }
  case X_FN_6: {
    xvm->result = primitive->fn_6(
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

void call_function_now_values(xvm_t *xvm, const function_t *fn,
                              uint8_t argc, const uint16_t *args, value_t *locals) {
  // VLA[0] is UB in C, so ensure at least 1 element
  value_t saved[argc > 0 ? argc : 1];
  for (size_t i = 0; i < argc; i++) {
    saved[i] = locals[args[i]];
  }

  size_t old_break = xvm->break_depth;
  xvm->break_depth = xvm_frame_count(xvm);
  frame_t *callee = make_function_frame_with_values(fn, argc, saved);
  xvm_push_frame(xvm, callee);
  xvm_execute(xvm);
  xvm->break_depth = old_break;
}

void call_function_now(xvm_t *xvm, const function_t *function) {
  size_t old_break = xvm->break_depth;
  xvm->break_depth = xvm_frame_count(xvm);
  frame_t *callee = make_function_frame(function, 0, NULL, NULL);
  xvm_push_frame(xvm, callee);
  xvm_execute(xvm);
  xvm->break_depth = old_break;
}

void call_definition_now(xvm_t *xvm, const definition_t *definition) {
  switch (definition->kind) {
  case PRIMITIVE_DEFINITION: {
    call_primitive(xvm, NULL, definition->primitive_definition.primitive, 0, NULL);
    return;
  }

  case FUNCTION_DEFINITION: {
    call_function_now(xvm, definition_function(definition));
    return;
  }

  case VARIABLE_DEFINITION: {
    unreachable();
  }
  }
}
