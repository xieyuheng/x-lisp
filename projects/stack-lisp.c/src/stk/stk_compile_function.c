#include "index.h"

static bool is_literal(value_t sexp) {
  return keyword_p(sexp)
    || xstring_p(sexp)
    || int_p(sexp)
    || float_p(sexp);
}

static bool is_quote(value_t sexp) {
  return sexp_has_tag(sexp, "@quote");
}

static void compile_instr(mod_t *mod, function_t *function, value_t sexp) {
  if (symbol_p(sexp)) {
    function_add_label(function, symbol_string(to_symbol(sexp)));
    return;
  }

  if (sexp_has_tag(sexp, "literal")) {
    value_t operand = x_car(x_cdr(sexp));
    if (is_literal(operand)) {
      struct instr_t instr;
      instr.op = OP_LITERAL;
      instr.literal.value = operand;
      function_append_instr(function, instr);
      return;
    } else {
      assert(is_quote);
      struct instr_t instr;
      instr.op = OP_LITERAL;
      instr.literal.value = x_car(x_cdr(operand));
      function_append_instr(function, instr);
      return;
    }
  }

  if (sexp_has_tag(sexp, "return")) {
    struct instr_t instr;
    instr.op = OP_RETURN;
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "call")) {
    value_t operand = x_car(x_cdr(sexp));
    const char *name = symbol_string(to_symbol(operand));
    definition_t *definition = mod_lookup_or_fail(mod, name);
    struct instr_t instr;
    instr.op = OP_CALL;
    instr.ref.definition = definition;
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "tail-call")) {
    value_t operand = x_car(x_cdr(sexp));
    const char *name = symbol_string(to_symbol(operand));
    definition_t *definition = mod_lookup_or_fail(mod, name);
    struct instr_t instr;
    instr.op = OP_TAIL_CALL;
    instr.ref.definition = definition;
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "ref")) {
    value_t operand = x_car(x_cdr(sexp));
    const char *name = symbol_string(to_symbol(operand));
    definition_t *definition = mod_lookup_or_fail(mod, name);
    struct instr_t instr;
    instr.op = OP_REF;
    instr.ref.definition = definition;
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "global-load")) {
    value_t operand = x_car(x_cdr(sexp));
    const char *name = symbol_string(to_symbol(operand));
    definition_t *definition = mod_lookup_or_fail(mod, name);
    struct instr_t instr;
    instr.op = OP_GLOBAL_LOAD;
    instr.ref.definition = definition;
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "global-store")) {
    value_t operand = x_car(x_cdr(sexp));
    const char *name = symbol_string(to_symbol(operand));
    definition_t *definition = mod_lookup_or_fail(mod, name);
    struct instr_t instr;
    instr.op = OP_GLOBAL_STORE;
    instr.ref.definition = definition;
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "apply")) {
    value_t operand = x_car(x_cdr(sexp));
    struct instr_t instr;
    instr.op = OP_APPLY;
    instr.apply.argc = to_int64(operand);
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "tail-apply")) {
    value_t operand = x_car(x_cdr(sexp));
    struct instr_t instr;
    instr.op = OP_TAIL_APPLY;
    instr.apply.argc = to_int64(operand);
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "local-load")) {
    value_t operand = x_car(x_cdr(sexp));
    struct instr_t instr;
    instr.op = OP_LOCAL_LOAD;
    instr.local.index = to_int64(operand);
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "local-store")) {
    value_t operand = x_car(x_cdr(sexp));
    struct instr_t instr;
    instr.op = OP_LOCAL_STORE;
    instr.local.index = to_int64(operand);
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "label")) {
    value_t operand = x_car(x_cdr(sexp));
    const char *label = symbol_string(to_symbol(operand));
    function_add_label(function, label);
    return;
  }

  if (sexp_has_tag(sexp, "jump")) {
    value_t operand = x_car(x_cdr(sexp));
    const char *label = symbol_string(to_symbol(operand));
    struct instr_t instr;
    instr.op = OP_JUMP;
    instr.jump.offset = 0;
    function_add_label_reference(function, label, function->code_length + 1);
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "jump-if-not")) {
    value_t operand = x_car(x_cdr(sexp));
    const char *label = symbol_string(to_symbol(operand));
    struct instr_t instr;
    instr.op = OP_JUMP_IF_NOT;
    instr.jump.offset = 0;
    function_add_label_reference(function, label, function->code_length + 1);
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "drop")) {
    struct instr_t instr;
    instr.op = OP_DROP;
    function_append_instr(function, instr);
    return;
  }

  who_printf("unhandled instr: "); print(sexp); newline();
}

void stk_compile_function(mod_t *mod, function_t *function, value_t body) {
  for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
    value_t sexp = x_list_get(x_int(i), body);
    compile_instr(mod, function, sexp);
  }

  function_patch_label_references(function);
}
