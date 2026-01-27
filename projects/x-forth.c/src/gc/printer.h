#pragma once

// holding state to support circular object.

struct printer_t {
    set_t *occurred_objects;
    hash_t *circle_indexes;
};

printer_t *make_printer(void);
void printer_free(printer_t *self);

void printer_collect_circle(printer_t *self, object_t *object);
bool printer_circle_start_p(printer_t *self, object_t *object);
bool printer_circle_end_p(printer_t *self, object_t *object);
size_t printer_circle_index(printer_t *self, object_t *object);
void printer_meet(printer_t *self, object_t *object);
