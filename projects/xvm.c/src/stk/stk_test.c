#include "index.h"

void stk_test(mod_t *mod, const char *snapshot, bool profile) {
  set_iter_t iter;
  set_iter_init(&iter, mod->test_names);
  char *name = set_iter_next(&iter);
  while (name) {
    if (!string_starts_with(name, "builtin/")) {
      definition_t *definition = mod_lookup_or_fail(mod, name);
      stk_test_definition(mod, snapshot, profile, definition);
    }

    name = set_iter_next(&iter);
  }
}

void stk_builtin_test(mod_t *mod, const char *snapshot, bool profile) {
  set_iter_t iter;
  set_iter_init(&iter, mod->test_names);
  char *name = set_iter_next(&iter);
  while (name) {
    if (string_starts_with(name, "builtin/")) {
      definition_t *definition = mod_lookup_or_fail(mod, name);
      stk_test_definition(mod, snapshot, profile, definition);
    }

    name = set_iter_next(&iter);
  }
}

void stk_test_definition(mod_t *mod, const char *snapshot, bool profile, definition_t *definition) {
  assert(definition->kind == FUNCTION_DEFINITION);
  double testing_start = time_millisecond();
  if (snapshot == NULL) {
    stk_call(mod, definition->name, NULL);
  } else {
    path_t *path = make_path(snapshot);
    path_join(path, "modules");
    path_join(path, definition->name);
    path_join_extension(path, ".out");
    char *segment = path_pop_segment(path);
    fs_ensure_directory(path_raw_string(path));
    path_push_segment(path, segment);

    stdout_push(path_raw_string(path));
    stk_call(mod, definition->name, NULL);
    stdout_drop();

    char *output = fs_read(path_raw_string(path));
    if (string_is_empty(output)) {
      string_free(output);
      fs_delete_file(path_raw_string(path));
    }

    path_free(path);
  }

  printf("[test] %s", definition->name);
  double testing_time = time_millisecond_passed(testing_start);
  if (profile) {
    printf(" -- %.3fms", testing_time);
  }

  printf("\n");
}
