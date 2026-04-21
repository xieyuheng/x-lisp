#include "index.h"

void li_test(mod_t *mod, const char *snapshot) {
  record_iter_t iter;
  record_iter_init(&iter, mod->definitions);
  definition_t *definition = record_iter_next_value(&iter);
  while (definition) {
    if (db_has_attribute(mod->db, definition->name, "is-test")
      && !string_starts_with(definition->name, "builtin/")) {
      li_test_definition(mod, snapshot, definition);
    }

    definition = record_iter_next_value(&iter);
  }
}

void li_builtin_test(mod_t *mod, const char *snapshot) {
  record_iter_t iter;
  record_iter_init(&iter, mod->definitions);
  definition_t *definition = record_iter_next_value(&iter);
  while (definition) {
    if (db_has_attribute(mod->db, definition->name, "is-test")
      && string_starts_with(definition->name, "builtin/")) {
      li_test_definition(mod, snapshot, definition);
    }

    definition = record_iter_next_value(&iter);
  }
}

void li_test_definition(mod_t *mod, const char *snapshot, definition_t *definition) {
  assert(definition->kind == FUNCTION_DEFINITION);
  printf("[test] %s\n", definition->name);
  if (snapshot == NULL) {
    li_call(mod, definition->name);
  } else {
    path_t *path = make_path(snapshot);
    path_join(path, "modules");
    path_join(path, definition->name);
    path_join_extension(path, ".out");
    char *segment = path_pop_segment(path);
    fs_ensure_directory(path_raw_string(path));
    path_push_segment(path, segment);

    stdout_push(path_raw_string(path));
    li_call(mod, definition->name);
    stdout_drop();

    char *output = fs_read(path_raw_string(path));
    if (string_is_empty(output)) {
      string_free(output);
      fs_delete_file(path_raw_string(path));
    }

    path_free(path);
  }
}
