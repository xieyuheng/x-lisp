#include "index.h"

token_t *make_token(token_kind_t kind, char *content, struct span_t span) {
  token_t *self = new(token_t);
  self->kind = kind;
  self->content = content;
  self->span = span;
  return self;
}

void token_free(token_t *self) {
  free(self->content);
  free(self);
}
