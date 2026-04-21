#include "index.h"

mod_t *li_load(path_t *path) {
  file_t *file = open_file_or_fail(path_raw_string(path), "r");
  char *string = file_read_string(file);
  mod_t *mod = make_mod(path);
  import_builtin(mod);

  // execute lines

  {
    size_t cursor = 0;
    char *line_string = string_next_line(string, &cursor);
    while (line_string) {
      line_t *line = parse_line(line_string);
      li_execute(mod, line);
      line_free(line);
      string_free(line_string);
      line_string = string_next_line(string, &cursor);
    }

    string_free(string);
  }

  // patch label references

  {
    record_iter_t iter;
    record_iter_init(&iter, mod->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
      if (definition_has_function(definition)) {
        function_patch_label_references(definition_function(definition));
      }

      definition = record_iter_next_value(&iter);
    }
  }

  // setup function arity

  {
    record_iter_t iter;
    record_iter_init(&iter, mod->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
      if (db_has_attribute(mod->db, definition->name, "arity")) {
        value_t value = db_get_attribute(mod->db, definition->name, "arity");
        function_t *function = definition_function(definition);
        function->arity = to_int64(value);
      }

      definition = record_iter_next_value(&iter);
    }
  }

  // setup variables

  {
    vm_t *vm = make_vm(mod);

    record_iter_t iter;
    record_iter_init(&iter, vm_mod(vm)->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
      if (definition->kind == VARIABLE_DEFINITION &&
          definition->variable_definition.function) {
        function_t *function = definition_function(definition);
        vm_push_frame(vm, make_function_frame(function));
        vm_execute(vm);
        definition->variable_definition.value = vm_pop(vm);
      }

      definition = record_iter_next_value(&iter);
    }

    vm_free(vm);
  }

  return mod;
}
