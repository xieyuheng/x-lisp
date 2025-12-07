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

static void
string_builder_ensure_capacity(string_builder_t *self) {
    if (self->length > self->max_length) {
        self->buffer = reallocate(
            self->buffer,
            self->max_length,
            self->max_length * 2);
        self->max_length *= 2;
        string_builder_ensure_capacity(self);
    }
}

// void
// string_builder_append_char(string_builder_t *self, char c) {

// }

// void
// string_builder_append_string(string_builder_t *self, char *string) {

// }

void
string_builder_clear(string_builder_t *self) {
    self->length = 0;
}

char *
string_builder_produce(string_builder_t *self) {
    return string_slice(self->buffer, 0, self->length);
}
