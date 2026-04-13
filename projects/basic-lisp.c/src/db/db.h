#pragma once

db_t *make_db(void);
void db_free(db_t *self);

bool db_add(db_t *db, uint64_t e, const keyword_t *k, value_t v, uint64_t tx);
bool db_delete(db_t *db, uint64_t e, const keyword_t *k, value_t v, uint64_t tx);
bool db_delete_attribute(db_t *db, uint64_t e, const keyword_t *k, uint64_t tx);
bool db_delete_entity(db_t *db, uint64_t e, uint64_t tx);
bool db_put(db_t *db, uint64_t e, const keyword_t *k, value_t v, uint64_t tx);
bool db_put_unique(db_t *db, uint64_t e, const keyword_t *k, value_t v, uint64_t tx);
