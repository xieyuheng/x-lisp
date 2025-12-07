#include "index.h"

struct string_builder_t {
    char *buffer;
    size_t length;
    // buffer size is max_length + 1 (the null end)
    size_t max_length;
};

string_builder_t *
make_string_builder(void) {
    string_builder_t *self = new(string_builder_t);
    self->max_length = 64;
    self->length = 0;
    self->buffer = allocate(self->max_length + 1);
    return self;
}

void
string_builder_free(string_builder_t *self) {
    free(self->buffer);
    free(self);
}
