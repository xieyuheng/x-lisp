#include "index.h"

static value_t x_function_name(value_t sexp) { return x_car(sexp); }
static value_t x_function_arity(value_t sexp) { return x_car(x_cdr(sexp)); }
static value_t x_function_body(value_t sexp) { return x_cdr(x_cdr(sexp)); }

static void prepare_define_function(mod_t *mod, value_t sexp) {
  const char *name = symbol_string(to_symbol(x_function_name(sexp)));
  function_t *function = make_function();
  function->arity = to_int64(x_function_arity(sexp));
  define_function(mod, name, function);
}

static void handle_define_function(mod_t *mod, value_t sexp) {
  const char *name = symbol_string(to_symbol(x_function_name(sexp)));
  definition_t *definition = mod_lookup_or_fail(mod, name);
  assert(definition->kind == FUNCTION_DEFINITION);
  function_t *function = definition->function_definition.function;
  stk_compile_function(mod, function, x_function_body(sexp));
}

static value_t x_variable_name(value_t sexp) { return x_car(sexp); }
static value_t x_variable_body(value_t sexp) { return x_cdr(sexp); }

static void prepare_define_variable(mod_t *mod, value_t sexp) {
  const char *name = symbol_string(to_symbol(x_variable_name(sexp)));
  function_t *function = make_function();
  define_variable_setup(mod, name, function);
}

static void handle_define_variable(mod_t *mod, value_t sexp) {
  const char *name = symbol_string(to_symbol(x_variable_name(sexp)));
  definition_t *definition = mod_lookup_or_fail(mod, name);
  assert(definition->kind == VARIABLE_DEFINITION);
  function_t *function = definition->variable_definition.function;
  stk_compile_function(mod, function, x_variable_body(sexp));
}

static value_t x_test_name(value_t sexp) { return x_car(sexp); }
static value_t x_test_body(value_t sexp) { return x_cdr(sexp); }

static void prepare_define_test(mod_t *mod, value_t sexp) {
  const char *name = symbol_string(to_symbol(x_test_name(sexp)));
  function_t *function = make_function();
  define_function(mod, name, function);
  set_add(mod->test_names, string_copy(name));
}

static void handle_define_test(mod_t *mod, value_t sexp) {
  const char *name = symbol_string(to_symbol(x_test_name(sexp)));
  definition_t *definition = mod_lookup_or_fail(mod, name);
  assert(definition->kind == FUNCTION_DEFINITION);
  function_t *function = definition->function_definition.function;
  stk_compile_function(mod, function, x_test_body(sexp));
}


void stk_declare(mod_t *mod, value_t sexps) {
  for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
    value_t sexp = x_list_get(x_int(i), sexps);
    if (sexp_has_tag(sexp, "declare-primitive-variable")) {
      const char *name = symbol_string(to_symbol(x_car(x_cdr(sexp))));
      definition_t *definition = mod_lookup_or_fail(mod, name);
      assert(definition->kind == VARIABLE_DEFINITION);
    }

    if (sexp_has_tag(sexp, "declare-primitive-function")) {
      const char *name = symbol_string(to_symbol(x_car(x_cdr(sexp))));
      uint64_t arity = to_int64(x_car(x_cdr(x_cdr(sexp))));
      definition_t *definition = mod_lookup_or_fail(mod, name);
      assert(definition->kind == PRIMITIVE_DEFINITION);
      assert(definition_arity(definition) == arity);
    }
  }
}

void stk_prepare(mod_t *mod, value_t sexps) {
  for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
    value_t sexp = x_list_get(x_int(i), sexps);
    if (sexp_has_tag(sexp, "define-function")) {
      prepare_define_function(mod, x_cdr(sexp));
    }

    if (sexp_has_tag(sexp, "define-variable")) {
      prepare_define_variable(mod, x_cdr(sexp));
    }

    if (sexp_has_tag(sexp, "define-test")) {
      prepare_define_test(mod, x_cdr(sexp));
    }
  }
}

void stk_compile(mod_t *mod, value_t sexps) {
  for (int64_t i = 0; i < to_int64(x_list_length(sexps)); i++) {
    value_t sexp = x_list_get(x_int(i), sexps);
    if (sexp_has_tag(sexp, "define-function")) {
      handle_define_function(mod, x_cdr(sexp));
    }

    if (sexp_has_tag(sexp, "define-variable")) {
      handle_define_variable(mod, x_cdr(sexp));
    }

    if (sexp_has_tag(sexp, "define-test")) {
      handle_define_test(mod, x_cdr(sexp));
    }
  }
}
