#include "index.h"

void call_function_now(xvm_t *xvm, const function_t *function) {
  size_t old_break = xvm->break_depth;
  xvm->break_depth = xvm->frame_count;
  xvm_push_function_frame(xvm, function, 0, NULL);
  xvm_execute(xvm);
  xvm->break_depth = old_break;
}

void call_function_now_with_args(xvm_t *xvm, const function_t *function,
                                  uint8_t argc, const uint16_t *args,
                                  value_t *caller_locals) {
  value_t saved[argc > 0 ? argc : 1];
  for (size_t i = 0; i < argc; i++) {
    saved[i] = caller_locals[args[i]];
  }

  size_t old_break = xvm->break_depth;
  xvm->break_depth = xvm->frame_count;
  xvm_push_function_frame_with_values(xvm, function, argc, saved);
  xvm_execute(xvm);
  xvm->break_depth = old_break;
}

void call_definition_now(xvm_t *xvm, const definition_t *definition) {
  switch (definition->kind) {
  case PRIMITIVE_DEFINITION: {
    xvm_push_root(xvm, xvm->result);
    call_primitive(xvm, NULL, definition->primitive_definition.primitive, 0, NULL);
    xvm_drop_root(xvm);
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

void call_definition_now_with_args(xvm_t *xvm, const definition_t *definition,
                                    uint8_t argc, const uint16_t *args,
                                    value_t *caller_locals) {
  switch (definition->kind) {
  case PRIMITIVE_DEFINITION: {
    call_primitive(xvm, caller_locals, definition->primitive_definition.primitive,
                   argc, args);
    return;
  }

  case FUNCTION_DEFINITION: {
    call_function_now_with_args(xvm, definition_function(definition), argc, args,
                                caller_locals);
    return;
  }

  case VARIABLE_DEFINITION: {
    unreachable();
  }
  }
}
