#include "index.h"

void program_test(program_t *program, const char *snapshot, bool profile, bool builtin) {
  set_iter_t iter;
  set_iter_init(&iter, program->test_names);
  char *name = set_iter_next(&iter);
  while (name) {
    if (string_starts_with(name, "self/")) {
      definition_t *definition = program_lookup_or_fail(program, name);
      program_test_definition(program, snapshot, profile, definition);
    } else if (builtin && string_starts_with(name, "meta-builtin/")) {
      definition_t *definition = program_lookup_or_fail(program, name);
      program_test_definition(program, snapshot, profile, definition);
    }

    name = set_iter_next(&iter);
  }
}

void program_test_definition(program_t *program, const char *snapshot, bool profile, definition_t *definition) {
  assert(definition->kind == FUNCTION_DEFINITION);
  double testing_start = time_millisecond();
  if (snapshot == NULL) {
    program_call_entry(program, definition->name);
  } else {
    path_t *path = make_path(snapshot);
    path_join(path, definition->name);
    path_join_extension(path, ".out");
    char *segment = path_pop_segment(path);
    fs_ensure_directory(path_raw_string(path));
    path_push_segment(path, segment);

    stdout_push(path_raw_string(path));
    program_call_entry(program, definition->name);
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
