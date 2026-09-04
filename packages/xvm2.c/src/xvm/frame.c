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
}

frame_t *frame_iter_next(frame_iter_t *self) {
  if (self->count == 0) return NULL;
  self->count--;

  uint8_t *bytes = self->xvm->frame_bytes;
  frame_t *frame = (frame_t *)(bytes + self->offset);
  self->offset = frame->prev_frame_offset;
  return frame;
}
