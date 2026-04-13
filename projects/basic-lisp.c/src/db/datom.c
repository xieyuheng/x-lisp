#include "index.h"

struct datom_t {
    entity_id_t *e;
    keyword_t *a;
    value_t v;
    uint64_t tx;
    bool op;
};
