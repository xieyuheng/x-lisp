#pragma once

// holding state to support circular object.

struct printer_t {
    set_t *occurred_objects;
    hash_t *circle_indexes;
};

printer_t *make_printer(void);
void printer_free(printer_t *self);
