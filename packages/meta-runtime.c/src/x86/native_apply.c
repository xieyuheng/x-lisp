#include "index.h"

static xvm_t *native_xvm = NULL;

void native_apply_set_xvm(xvm_t *xvm) {
  native_xvm = xvm;
}

static value_t call_primitive_values(const primitive_t *primitive,
                                      uint8_t argc, value_t *args) {
  (void) argc;
  switch (primitive->fn_kind) {
  case X_FN_0: return primitive->fn_0();
  case X_FN_1: return primitive->fn_1(args[0]);
  case X_FN_2: return primitive->fn_2(args[0], args[1]);
  case X_FN_3: return primitive->fn_3(args[0], args[1], args[2]);
  case X_FN_4: return primitive->fn_4(args[0], args[1], args[2], args[3]);
  case X_FN_5: return primitive->fn_5(args[0], args[1], args[2], args[3], args[4]);
  case X_FN_6: return primitive->fn_6(args[0], args[1], args[2], args[3], args[4], args[5]);
  }
  unreachable();
}

static void push_roots(value_t *values, size_t count) {
  if (!native_xvm) return;
  for (size_t i = 0; i < count; i++) {
    xvm_push_root(native_xvm, values[i]);
  }
}

static void drop_roots(size_t count) {
  if (!native_xvm) return;
  for (size_t i = 0; i < count; i++) {
    xvm_drop_root(native_xvm);
  }
}

value_t native_apply(value_t target, uint8_t argc, value_t *args) {
  if (definition_p(target)) {
    definition_t *def = to_definition(target);

    if (!definition_has_arity(def)) {
      who_printf("definition has no arity in native_apply: %s\n", def->name);
      exit(1);
    }

    size_t arity = definition_arity(def);

    if (argc == arity) {
      if (def->kind == PRIMITIVE_DEFINITION) {
        return call_primitive_values(
          def->primitive_definition.primitive, argc, args);
      } else if (def->kind == FUNCTION_DEFINITION) {
        void *entry;
        memory_load(&def->function_definition.function->buffer, entry);
        if (entry) {
          push_roots(args, argc);
          value_t result = native_call_native_fn(entry, argc, args);
          drop_roots(argc);
          return result;
        }
        who_printf("no native entry for function in native_apply: %s\n", def->name);
        exit(1);
      }
    } else if (argc < arity) {
      curry_t *curry = make_curry(target, arity - argc, argc);
      for (size_t i = 0; i < argc; i++) {
        curry->args[i] = args[i];
      }
      return x_object(curry);
    } else {
      value_t result;
      if (def->kind == PRIMITIVE_DEFINITION) {
        result = call_primitive_values(
          def->primitive_definition.primitive, (uint8_t)arity, args);
      } else {
        void *entry;
        memory_load(&def->function_definition.function->buffer, entry);
        if (!entry) {
          who_printf("no native entry for function in native_apply: %s\n", def->name);
          exit(1);
        }
        push_roots(args, (uint8_t)arity);
        result = native_call_native_fn(entry, (uint8_t)arity, args);
        drop_roots((uint8_t)arity);
      }
      return native_apply(result, argc - (uint8_t)arity, args + arity);
    }
  } else if (curry_p(target)) {
    curry_t *curry = to_curry(target);
    size_t needed = curry->arity;

    if (argc == needed) {
      size_t total = curry->size + argc;
      value_t combined[total > 0 ? total : 1];
      for (size_t i = 0; i < curry->size; i++) combined[i] = curry->args[i];
      for (size_t i = 0; i < argc; i++) combined[curry->size + i] = args[i];
      return native_apply(curry->target, (uint8_t)total, combined);
    } else if (argc < needed) {
      curry_t *new_curry = make_curry(target, needed - argc, curry->size + argc);
      for (size_t i = 0; i < curry->size; i++)
        new_curry->args[i] = curry->args[i];
      for (size_t i = 0; i < argc; i++)
        new_curry->args[curry->size + i] = args[i];
      return x_object(new_curry);
    } else {
      size_t total = curry->size + needed;
      value_t combined[total > 0 ? total : 1];
      for (size_t i = 0; i < curry->size; i++) combined[i] = curry->args[i];
      for (size_t i = 0; i < needed; i++) combined[curry->size + i] = args[i];
      value_t result = native_apply(curry->target, (uint8_t)total, combined);
      size_t remaining = argc - needed;
      value_t remaining_args[remaining > 0 ? remaining : 1];
      for (size_t i = 0; i < remaining; i++) remaining_args[i] = args[needed + i];
      return native_apply(result, (uint8_t)remaining, remaining_args);
    }
  }

  who_printf("unhandled value in native_apply\n");
  who_printf("  value: "); print_value(target); printf("\n");
  exit(1);
}
