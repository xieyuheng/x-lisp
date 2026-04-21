#include "index.h"

static definition_t *ensure_definition(mod_t *mod, const char *name) {
  definition_t *definition = mod_lookup(mod, name);
  if (definition) return definition;

  if (db_has_attribute(mod->db, name, "is-variable")) {
    define_variable_setup(mod, name, make_function());
  } else {
    define_function(mod, name, make_function());
  }

  return mod_lookup(mod, name);
}

void li_execute_fn(mod_t *mod, line_t *line) {
  const path_t *path = line_path(line);
  definition_t *definition = ensure_definition(mod, path_raw_string(path));
  function_t *function = definition_function(definition);
  keyword_t *op = to_keyword(line_get_arg(line, 0));

  if (string_equal(op->string, "literal")) {
    struct instr_t instr;
    instr.op = OP_LITERAL;
    instr.literal.value = line_get_arg(line, 1);
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "return")) {
    struct instr_t instr;
    instr.op = OP_RETURN;
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "call")) {
    keyword_t *operand = to_keyword(line_get_arg(line, 1));
    definition_t *definition = ensure_definition(mod, operand->string);
    struct instr_t instr;
    instr.op = OP_CALL;
    instr.ref.definition = definition;
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "tail-call")) {
    keyword_t *operand = to_keyword(line_get_arg(line, 1));
    definition_t *definition = ensure_definition(mod, operand->string);
    struct instr_t instr;
    instr.op = OP_TAIL_CALL;
    instr.ref.definition = definition;
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "ref")) {
    keyword_t *operand = to_keyword(line_get_arg(line, 1));
    definition_t *definition = ensure_definition(mod, operand->string);
    struct instr_t instr;
    instr.op = OP_REF;
    instr.ref.definition = definition;
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "global-load")) {
    keyword_t *operand = to_keyword(line_get_arg(line, 1));
    definition_t *definition = ensure_definition(mod, operand->string);
    struct instr_t instr;
    instr.op = OP_GLOBAL_LOAD;
    instr.ref.definition = definition;
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "global-store")) {
    keyword_t *operand = to_keyword(line_get_arg(line, 1));
    definition_t *definition = ensure_definition(mod, operand->string);
    struct instr_t instr;
    instr.op = OP_GLOBAL_STORE;
    instr.ref.definition = definition;
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "apply")) {
    struct instr_t instr;
    instr.op = OP_APPLY;
    instr.apply.argc = to_int64(line_get_arg(line, 1));
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "tail-apply")) {
    struct instr_t instr;
    instr.op = OP_TAIL_APPLY;
    instr.apply.argc = to_int64(line_get_arg(line, 1));
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "local-load")) {
    struct instr_t instr;
    instr.op = OP_LOCAL_LOAD;
    instr.local.index = to_int64(line_get_arg(line, 1));
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "local-store")) {
    struct instr_t instr;
    instr.op = OP_LOCAL_STORE;
    instr.local.index = to_int64(line_get_arg(line, 1));
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "label")) {
    keyword_t *operand = to_keyword(line_get_arg(line, 1));
    function_add_label(function, operand->string);
    return;
  }

  if (string_equal(op->string, "jump")) {
    keyword_t *operand = to_keyword(line_get_arg(line, 1));
    struct instr_t instr;
    instr.op = OP_JUMP;
    instr.jump.offset = 0;
    function_add_label_reference(
      function, operand->string, function->code_length + 1);
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "jump-if-not")) {
    keyword_t *operand = to_keyword(line_get_arg(line, 1));
    struct instr_t instr;
    instr.op = OP_JUMP_IF_NOT;
    instr.jump.offset = 0;
    function_add_label_reference(
      function, operand->string, function->code_length + 1);
    function_append_instr(function, instr);
    return;
  }

  if (string_equal(op->string, "drop")) {
    struct instr_t instr;
    instr.op = OP_DROP;
    function_append_instr(function, instr);
    return;
  }

  who_printf("unhandled op: %s\n", op->string);
}
