#pragma once

struct frame_t {
  uint8_t *pc;
  size_t prev_frame_offset;
  value_t locals[];
};

value_t *frame_locals(frame_t *self);
size_t frame_byte_size(uint16_t local_count);

typedef struct frame_iter_t {
  const xvm_t *xvm;
  size_t offset;
  size_t count;
  size_t frame_end;
  size_t local_count;
} frame_iter_t;

void frame_iter_init(frame_iter_t *self, const xvm_t *xvm);
frame_t *frame_iter_next(frame_iter_t *self);
