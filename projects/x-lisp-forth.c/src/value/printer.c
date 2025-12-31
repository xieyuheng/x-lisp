#include "index.h"

printer_t *
make_printer(void) {
    printer_t *self = new(printer_t);
    self->occurred_objects = make_set();
    self->circle_indexes = make_hash();
    return self;
}

void
printer_free(printer_t *self) {
    set_free(self->occurred_objects);
    hash_free(self->circle_indexes);
    free(self);
}

static void
printer_collect_circle(printer_t *printer, value_t value) {
    (void) printer;
    (void) value;
}

void
print(value_t value) {
    printer_t *printer = make_printer();
    printer_collect_circle(printer, value);
    // value_print(printer, value);
    printer_free(printer);
}
