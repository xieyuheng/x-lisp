#pragma once

struct frame_t {
  const function_t *function;
  uint8_t *pc;
  uint16_t local_count;
  size_t prev_sp;
};

static inline value_t *frame_locals(frame_t *self) {
  return (value_t *)(self + 1);
}

static inline size_t frame_byte_size(uint16_t local_count) {
  return sizeof(frame_t) + local_count * sizeof(value_t);
}
