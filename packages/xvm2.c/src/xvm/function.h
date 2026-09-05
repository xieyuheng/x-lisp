#pragma once

struct function_t {
  char *name;
  uint16_t arity;
  uint16_t local_count;
  uint32_t code_length;
  uint8_t *bytecode;
  uint8_t *threaded_code;
  uint32_t threaded_code_length;
  size_t frame_size;
  bool threaded_ready;
};

function_t *make_function(const char *name, uint16_t arity, uint16_t local_count);
void function_free(function_t *self);
