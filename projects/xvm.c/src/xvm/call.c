#include "index.h"

inline void call_function(xvm_t *xvm, const function_t *function,
                          uint8_t argc, const uint16_t *args, value_t *caller_locals) {
  xvm_push_frame(xvm, make_function_frame(function, argc, args, caller_locals));
  return;
}

inline void call_function_now(xvm_t *xvm, const function_t *function) {
  xvm_push_frame(xvm, make_break_frame());
  xvm_push_frame(xvm, make_function_frame(function, 0, NULL, NULL));
  xvm_execute(xvm);
  return;
}

inline void call_definition(xvm_t *xvm, const definition_t *definition,
                            uint8_t argc, const uint16_t *args, value_t *caller_locals) {
  switch (definition->kind) {
  case PRIMITIVE_DEFINITION: {
    call_primitive(xvm, caller_locals, definition->primitive_definition.primitive,
                   argc, args);
    return;
  }

  case FUNCTION_DEFINITION: {
    call_function(xvm, definition_function(definition), argc, args, caller_locals);
    return;
  }

  case VARIABLE_DEFINITION: {
    unreachable();
  }
  }
}

inline void call_definition_now(xvm_t *xvm, const definition_t *definition) {
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

inline void call_definition_now_with_args(xvm_t *xvm, const definition_t *definition,
                                           uint8_t argc, const uint16_t *args,
                                           value_t *caller_locals) {
  switch (definition->kind) {
  case PRIMITIVE_DEFINITION: {
    call_primitive(xvm, caller_locals, definition->primitive_definition.primitive,
                   argc, args);
    return;
  }

  case FUNCTION_DEFINITION: {
    xvm_push_frame(xvm, make_break_frame());
    xvm_push_frame(xvm, make_function_frame(definition_function(definition),
                                              argc, args, caller_locals));
    xvm_execute(xvm);
    return;
  }

  case VARIABLE_DEFINITION: {
    unreachable();
  }
  }
}
