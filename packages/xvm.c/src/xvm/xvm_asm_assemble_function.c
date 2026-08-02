#include "index.h"

static bool is_literal(value_t sexp) {
  return is_keyword(sexp)
    || is_xstring(sexp)
    || is_int(sexp)
    || is_float(sexp);
}

// TODO: The Chinese parser produces `@引用` for quoted symbols.
// If this assembler is to support Chinese compilation output,
// it must recognize `@引用` here as well.
static bool is_quote(value_t sexp) {
  return sexp_has_tag(sexp, "@quote");
}

static void assemble_call_args(struct instr_t *instr, value_t operands) {
  uint8_t argc = to_int64(x_list_length(operands));
  instr->call.argc = argc;
  instr->call.args = allocate(sizeof(uint16_t) * argc);
  for (size_t i = 0; i < argc; i++) {
    instr->call.args[i] = to_int64(x_list_get(x_int(i), operands));
  }
}

static void assemble_apply_args(struct instr_t *instr, value_t operands) {
  uint8_t argc = to_int64(x_list_length(operands));
  instr->apply.argc = argc;
  instr->apply.args = allocate(sizeof(uint16_t) * argc);
  for (size_t i = 0; i < argc; i++) {
    instr->apply.args[i] = to_int64(x_list_get(x_int(i), operands));
  }
}

static void assemble_instr(mod_t *mod, function_t *function, value_t sexp) {
  if (is_symbol(sexp)) {
    function_add_label(function, symbol_string(to_symbol(sexp)));
    return;
  }

  if (sexp_has_tag(sexp, "move")) {
    value_t args = x_cdr(sexp);
    struct instr_t instr;
    instr.op = OP_MOVE;
    instr.mov.dst = to_int64(x_car(args));
    instr.mov.src = to_int64(x_car(x_cdr(args)));
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "load")) {
    value_t args = x_cdr(sexp);
    value_t operand = x_car(x_cdr(args));
    if (is_literal(operand)) {
      struct instr_t instr;
      instr.op = OP_LOAD;
      instr.load.dst = to_int64(x_car(args));
      instr.load.value = operand;
      function_append_instr(function, instr);
      return;
    } else {
      assert(is_quote);
      struct instr_t instr;
      instr.op = OP_LOAD;
      instr.load.dst = to_int64(x_car(args));
      instr.load.value = x_car(x_cdr(operand));
      function_append_instr(function, instr);
      return;
    }
  }

  if (sexp_has_tag(sexp, "load-result")) {
    value_t args = x_cdr(sexp);
    struct instr_t instr;
    instr.op = OP_LOAD_RESULT;
    instr.load_result.dst = to_int64(x_car(args));
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "return")) {
    value_t args = x_cdr(sexp);
    struct instr_t instr;
    instr.op = OP_RETURN;
    instr.ret.src = to_int64(x_car(args));
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "call")) {
    value_t args = x_cdr(sexp);
    const char *name = symbol_string(to_symbol(x_car(args)));
    definition_t *definition = mod_lookup_or_fail(mod, name);
    struct instr_t instr;
    instr.op = OP_CALL;
    instr.call.definition = definition;
    assemble_call_args(&instr, x_cdr(args));
    function_append_instr(function, instr);
    free(instr.call.args);
    return;
  }

  if (sexp_has_tag(sexp, "tail-call")) {
    value_t args = x_cdr(sexp);
    const char *name = symbol_string(to_symbol(x_car(args)));
    definition_t *definition = mod_lookup_or_fail(mod, name);
    struct instr_t instr;
    instr.op = OP_TAIL_CALL;
    instr.call.definition = definition;
    assemble_call_args(&instr, x_cdr(args));
    function_append_instr(function, instr);
    free(instr.call.args);
    return;
  }

  if (sexp_has_tag(sexp, "ref")) {
    value_t args = x_cdr(sexp);
    struct instr_t instr;
    instr.op = OP_REF;
    instr.ref.dst = to_int64(x_car(args));
    instr.ref.definition = mod_lookup_or_fail(mod, symbol_string(to_symbol(x_car(x_cdr(args)))));
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "global-load")) {
    value_t args = x_cdr(sexp);
    struct instr_t instr;
    instr.op = OP_GLOBAL_LOAD;
    instr.global_load.dst = to_int64(x_car(args));
    instr.global_load.definition = mod_lookup_or_fail(mod, symbol_string(to_symbol(x_car(x_cdr(args)))));
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "global-store")) {
    value_t args = x_cdr(sexp);
    struct instr_t instr;
    instr.op = OP_GLOBAL_STORE;
    instr.global_store.src = to_int64(x_car(args));
    instr.global_store.definition = mod_lookup_or_fail(mod, symbol_string(to_symbol(x_car(x_cdr(args)))));
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "apply")) {
    value_t args = x_cdr(sexp);
    struct instr_t instr;
    instr.op = OP_APPLY;
    instr.apply.target = to_int64(x_car(args));
    assemble_apply_args(&instr, x_cdr(args));
    function_append_instr(function, instr);
    free(instr.apply.args);
    return;
  }

  if (sexp_has_tag(sexp, "tail-apply")) {
    value_t args = x_cdr(sexp);
    struct instr_t instr;
    instr.op = OP_TAIL_APPLY;
    instr.apply.target = to_int64(x_car(args));
    assemble_apply_args(&instr, x_cdr(args));
    function_append_instr(function, instr);
    free(instr.apply.args);
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
    function_add_label_reference(function, label, buffer_length(function->buffer) + 1);
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "jump-if-not")) {
    value_t args = x_cdr(sexp);
    const char *label = symbol_string(to_symbol(x_car(x_cdr(args))));
    struct instr_t instr;
    instr.op = OP_JUMP_IF_NOT;
    instr.jump_if_not.src = to_int64(x_car(args));
    instr.jump_if_not.offset = 0;
    function_add_label_reference(function, label, buffer_length(function->buffer) + 1 + sizeof(uint16_t));
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "iadd") || sexp_has_tag(sexp, "isub")
      || sexp_has_tag(sexp, "imul") || sexp_has_tag(sexp, "idiv")
      || sexp_has_tag(sexp, "imod") || sexp_has_tag(sexp, "int-greater")
      || sexp_has_tag(sexp, "int-less") || sexp_has_tag(sexp, "int-greater-or-equal")
      || sexp_has_tag(sexp, "int-less-or-equal")) {
    value_t args = x_cdr(sexp);
    struct instr_t instr;
    if (sexp_has_tag(sexp, "iadd")) instr.op = OP_IADD;
    if (sexp_has_tag(sexp, "isub")) instr.op = OP_ISUB;
    if (sexp_has_tag(sexp, "imul")) instr.op = OP_IMUL;
    if (sexp_has_tag(sexp, "idiv")) instr.op = OP_IDIV;
    if (sexp_has_tag(sexp, "imod")) instr.op = OP_IMOD;
    if (sexp_has_tag(sexp, "int-greater")) instr.op = OP_INT_GREATER;
    if (sexp_has_tag(sexp, "int-less")) instr.op = OP_INT_LESS;
    if (sexp_has_tag(sexp, "int-greater-or-equal")) instr.op = OP_INT_GREATER_OR_EQUAL;
    if (sexp_has_tag(sexp, "int-less-or-equal")) instr.op = OP_INT_LESS_OR_EQUAL;
    instr.arith.dst = to_int64(x_car(args));
    instr.arith.src1 = to_int64(x_car(x_cdr(args)));
    instr.arith.src2 = to_int64(x_car(x_cdr(x_cdr(args))));
    function_append_instr(function, instr);
    return;
  }

  if (sexp_has_tag(sexp, "ineg") || sexp_has_tag(sexp, "int-is-positive")
      || sexp_has_tag(sexp, "int-is-non-negative") || sexp_has_tag(sexp, "int-is-non-zero")) {
    value_t args = x_cdr(sexp);
    struct instr_t instr;
    if (sexp_has_tag(sexp, "ineg")) instr.op = OP_INEG;
    if (sexp_has_tag(sexp, "int-is-positive")) instr.op = OP_INT_POSITIVE;
    if (sexp_has_tag(sexp, "int-is-non-negative")) instr.op = OP_INT_NON_NEGATIVE;
    if (sexp_has_tag(sexp, "int-is-non-zero")) instr.op = OP_INT_NON_ZERO;
    instr.unary.dst = to_int64(x_car(args));
    instr.unary.src = to_int64(x_car(x_cdr(args)));
    function_append_instr(function, instr);
    return;
  }

  who_printf("unhandled instr: "); print_value(sexp); printf("\n");
}

void xvm_asm_assemble_function(mod_t *mod, function_t *function, value_t body) {
  for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
    value_t sexp = x_list_get(x_int(i), body);
    assemble_instr(mod, function, sexp);
  }

  function_patch_label_references(function);
}

static size_t count_call_args(value_t args) {
  return to_int64(x_list_length(args));
}

static size_t instr_max_local(value_t sexp) {
  if (is_symbol(sexp)) return 0;

  if (sexp_has_tag(sexp, "move")) {
    value_t args = x_cdr(sexp);
    size_t a = to_int64(x_car(args));
    size_t b = to_int64(x_car(x_cdr(args)));
    return a > b ? a : b;
  }

  if (sexp_has_tag(sexp, "load")) {
    return to_int64(x_car(x_cdr(sexp)));
  }

  if (sexp_has_tag(sexp, "load-result")) {
    return to_int64(x_car(x_cdr(sexp)));
  }

  if (sexp_has_tag(sexp, "return")) {
    return to_int64(x_car(x_cdr(sexp)));
  }

  if (sexp_has_tag(sexp, "call") || sexp_has_tag(sexp, "tail-call")) {
    value_t all_args = x_cdr(sexp);
    value_t indices = x_cdr(all_args);
    size_t count = count_call_args(indices);
    size_t max = 0;
    for (size_t i = 0; i < count; i++) {
      size_t v = to_int64(x_list_get(x_int(i), indices));
      if (v > max) max = v;
    }
    return max;
  }

  if (sexp_has_tag(sexp, "ref")) {
    return to_int64(x_car(x_cdr(sexp)));
  }

  if (sexp_has_tag(sexp, "global-load")) {
    return to_int64(x_car(x_cdr(sexp)));
  }

  if (sexp_has_tag(sexp, "global-store")) {
    return to_int64(x_car(x_cdr(sexp)));
  }

  if (sexp_has_tag(sexp, "apply") || sexp_has_tag(sexp, "tail-apply")) {
    value_t all_args = x_cdr(sexp);
    size_t target = to_int64(x_car(all_args));
    value_t indices = x_cdr(all_args);
    size_t count = count_call_args(indices);
    size_t max = target;
    for (size_t i = 0; i < count; i++) {
      size_t v = to_int64(x_list_get(x_int(i), indices));
      if (v > max) max = v;
    }
    return max;
  }

  if (sexp_has_tag(sexp, "jump-if-not")) {
    return to_int64(x_car(x_cdr(sexp)));
  }

  if (sexp_has_tag(sexp, "iadd") || sexp_has_tag(sexp, "isub")
      || sexp_has_tag(sexp, "imul") || sexp_has_tag(sexp, "idiv")
      || sexp_has_tag(sexp, "imod") || sexp_has_tag(sexp, "int-greater")
      || sexp_has_tag(sexp, "int-less") || sexp_has_tag(sexp, "int-greater-or-equal")
      || sexp_has_tag(sexp, "int-less-or-equal")) {
    value_t args = x_cdr(sexp);
    size_t dst = to_int64(x_car(args));
    size_t src1 = to_int64(x_car(x_cdr(args)));
    size_t src2 = to_int64(x_car(x_cdr(x_cdr(args))));
    size_t max = dst > src1 ? dst : src1;
    return max > src2 ? max : src2;
  }

  if (sexp_has_tag(sexp, "ineg") || sexp_has_tag(sexp, "int-is-positive")
      || sexp_has_tag(sexp, "int-is-non-negative") || sexp_has_tag(sexp, "int-is-non-zero")) {
    value_t args = x_cdr(sexp);
    size_t dst = to_int64(x_car(args));
    size_t src = to_int64(x_car(x_cdr(args)));
    return dst > src ? dst : src;
  }

  return 0;
}

size_t xvm_asm_compute_function_local_count(size_t arity, value_t body) {
  size_t max_index = 0;
  if (arity > 0) {
    max_index = arity - 1;
  }

  for (int64_t i = 0; i < to_int64(x_list_length(body)); i++) {
    value_t sexp = x_list_get(x_int(i), body);
    size_t m = instr_max_local(sexp);
    if (m > max_index) max_index = m;
  }

  size_t local_count = max_index + 1;
  if (local_count < 1) local_count = 1;
  return local_count;
}
