#pragma once

datom_t *make_datom(
    uint64_t entity_id,
    const keyword_t *attribute,
    value_t value,
    uint64_t transaction_id,
    bool affirmative_p);
void datom_free(datom_t *self);
