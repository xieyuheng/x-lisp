#pragma once

struct function_t {
  const char *name;
  size_t local_count;
  size_t arity;
  buffer_t *buffer;
};

function_t *make_function(const char *name);
void function_free(function_t *self);