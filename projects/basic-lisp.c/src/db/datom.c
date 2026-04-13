#include "index.h"

struct datom_t {
    uint64_t entity_id;
    const keyword_t *attribute;
    value_t value;
    uint64_t transaction_id;
    bool affirmative_p;
};
