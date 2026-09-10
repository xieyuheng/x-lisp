#pragma once

struct function_t {
  char *name;
  uint16_t arity;
  uint16_t local_count;
  uint32_t code_length;
  uint8_t *bytecode;
  size_t frame_size;
};

function_t *make_function(const char *name, uint16_t arity, uint16_t local_count);
void function_free(function_t *self);
