#include "index.h"

inline value_t *frame_locals(frame_t *self) {
  return self->locals;
}

inline size_t frame_byte_size(uint16_t local_count) {
  return sizeof(frame_t) + local_count * sizeof(value_t);
}

void frame_iter_init(frame_iter_t *self, const xvm_t *xvm) {
  self->xvm = xvm;
  self->offset = xvm->frame_offset;
  self->count = xvm->frame_count;
  self->frame_end = xvm->frame_top;
  self->local_count = 0;
}

frame_t *frame_iter_next(frame_iter_t *self) {
  if (self->count == 0) return NULL;
  self->count--;

  uint8_t *bytes = self->xvm->frame_bytes;
  frame_t *frame = (frame_t *)(bytes + self->offset);

  size_t frame_size = self->frame_end - self->offset;
  self->local_count = (frame_size - sizeof(frame_t)) / sizeof(value_t);

  size_t next_end = self->offset;
  self->offset = frame->prev_frame_offset;
  self->frame_end = next_end;

  return frame;
}
