#include "index.h"

void apply(xvm_t *xvm, value_t target, uint8_t argc, const uint16_t *args, value_t *locals) {
  if (!is_closure(target)) {
    who_printf("unhandled value\n");
    who_printf("  value: "); print_value(target); printf("\n");
    who_printf("  n: %d\n", argc);
    exit(1);
  }

  apply_closure(xvm, to_closure(target), argc, args, locals);
}

void apply_closure(xvm_t *xvm, closure_t *closure, uint8_t argc, const uint16_t *args, value_t *locals) {
  size_t total = 1 + argc;
  value_t temp_locals[total > 0 ? total : 1];
  temp_locals[0] = x_object(closure);
  for (size_t i = 0; i < argc; i++) {
    temp_locals[1 + i] = locals[args[i]];
  }

  size_t old_break = xvm->break_depth;
  xvm->break_depth = xvm->frame_count;
  xvm_push_function_frame_with_values(xvm, closure->function, total, temp_locals);
  xvm_execute(xvm);
  xvm->break_depth = old_break;
}
