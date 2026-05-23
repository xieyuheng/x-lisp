#include "index.h"

inline void call_definition(xvm_t *xvm, const definition_t *definition) {
  switch (definition->kind) {
  case PRIMITIVE_DEFINITION: {
    call_primitive_now(xvm, definition->primitive_definition.primitive);
    return;
  }

  case FUNCTION_DEFINITION: {
    call_function(xvm, definition_function(definition));
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
    call_primitive_now(xvm, definition->primitive_definition.primitive);
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

inline void call_function(xvm_t *xvm, const function_t *function) {
  xvm_push_frame(xvm, make_function_frame(function));
  return;
}

inline void call_function_now(xvm_t *xvm, const function_t *function) {
  xvm_push_frame(xvm, make_break_frame());
  xvm_push_frame(xvm, make_function_frame(function));
  xvm_execute(xvm);
  return;
}

inline void call_primitive_now(xvm_t *xvm, const primitive_t *primitive) {
  switch (primitive->fn_kind) {
  case X_FN_N: {
    primitive->fn(xvm);
    return;
  }

  case X_FN_0: {
    value_t result = primitive->fn_0();
    xvm_push(xvm, result);
    return;
  }

  case X_FN_1: {
    value_t x1 = xvm_pop(xvm);
    value_t result = primitive->fn_1(x1);
    xvm_push(xvm, result);
    return;
  }

  case X_FN_2: {
    value_t x2 = xvm_pop(xvm);
    value_t x1 = xvm_pop(xvm);
    value_t result = primitive->fn_2(x1, x2);
    xvm_push(xvm, result);
    return;
  }

  case X_FN_3: {
    value_t x3 = xvm_pop(xvm);
    value_t x2 = xvm_pop(xvm);
    value_t x1 = xvm_pop(xvm);
    value_t result = primitive->fn_3(x1, x2, x3);
    xvm_push(xvm, result);
    return;
  }

  case X_FN_4: {
    value_t x4 = xvm_pop(xvm);
    value_t x3 = xvm_pop(xvm);
    value_t x2 = xvm_pop(xvm);
    value_t x1 = xvm_pop(xvm);
    value_t result = primitive->fn_4(x1, x2, x3, x4);
    xvm_push(xvm, result);
    return;
  }

  case X_FN_5: {
    value_t x5 = xvm_pop(xvm);
    value_t x4 = xvm_pop(xvm);
    value_t x3 = xvm_pop(xvm);
    value_t x2 = xvm_pop(xvm);
    value_t x1 = xvm_pop(xvm);
    value_t result = primitive->fn_5(x1, x2, x3, x4, x5);
    xvm_push(xvm, result);
    return;
  }

  case X_FN_6: {
    value_t x6 = xvm_pop(xvm);
    value_t x5 = xvm_pop(xvm);
    value_t x4 = xvm_pop(xvm);
    value_t x3 = xvm_pop(xvm);
    value_t x2 = xvm_pop(xvm);
    value_t x1 = xvm_pop(xvm);
    value_t result = primitive->fn_6(x1, x2, x3, x4, x5, x6);
    xvm_push(xvm, result);
    return;
  }
  }
}
