#include "index.h"

struct datom_t {
    uint64_t entity_id;
    const keyword_t *attribute;
    value_t value;
    uint64_t transaction_id;
    bool affirmative_p;
};

datom_t *
make_datom(
    uint64_t entity_id,
    const keyword_t *attribute,
    value_t value,
    uint64_t transaction_id,
    bool affirmative_p
) {
    datom_t *self = new(datom_t);
    self->entity_id = entity_id;
    self->attribute = attribute;
    self->value = value;
    self->transaction_id = transaction_id;
    self->affirmative_p = affirmative_p;
    return self;
}

void
datom_free(datom_t *self) {
    free(self);
}
