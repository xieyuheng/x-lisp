#include "index.h"

command_t *
make_command(const char *name) {
    command_t *self = new(command_t);
    self->name = name;
    self->description = NULL;
    self->help = NULL;
    self->run = NULL;
    return self;
}

void
command_free(command_t *self) {
    free(self);
}
