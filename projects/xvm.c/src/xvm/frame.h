#pragma once

struct frame_t {
  const function_t *function;
  uint8_t *pc;
  size_t prev_frame_offset;
  size_t local_count;
};

static inline value_t *frame_locals(frame_t *frame) {
  return (value_t *)((uint8_t *)frame + sizeof(frame_t));
}

static inline size_t frame_byte_size(size_t local_count) {
  return sizeof(frame_t) + local_count * sizeof(value_t);
}
