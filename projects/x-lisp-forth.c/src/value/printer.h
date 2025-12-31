#pragma once

// holding state to support circular object.

struct printer_t {
    set_t *occurred_objects;
    hash_t *circle_indexes;
};

