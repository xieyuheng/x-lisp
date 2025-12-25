#include "index.h"
#include "hash_primes.h"

#define INDEX_REHASH_PERCENTAGE 50
#define LENGTH_REHASH_PERCENTAGE 75

struct hash_t {
    size_t prime_index;
    size_t used_indexes_size;
    size_t length;
    hash_entry_t **entries;

    hash_entry_t *cursor_entry;

    hash_entry_t *first_entry;
    hash_entry_t *last_entry;

    hash_fn_t *hash_fn;
    free_fn_t *key_free_fn;
    equal_fn_t *key_equal_fn;
    free_fn_t *value_free_fn;
};

size_t
hash_key_index(hash_t *self, const void *key) {
    size_t base = self->hash_fn ? self->hash_fn(key) : (size_t) key;
    size_t limit = hash_primes[self->prime_index];
    size_t index = base % limit;
    return index;
}

// reused by `hash_purge` to shrink table.
static void
hash_init(hash_t *self) {
    self->prime_index = 0;
    self->used_indexes_size = 0;
    self->length = 0;
    size_t limit = hash_primes[self->prime_index];
    self->entries = allocate_pointers(limit);
    self->cursor_entry = NULL;
}

hash_t *
make_hash(void) {
    hash_t *self = new(hash_t);
    hash_init(self);
    return self;
}

void
hash_put_hash_fn(hash_t *self, hash_fn_t *hash_fn) {
    self->hash_fn = hash_fn;
}

void
hash_put_value_free_fn(hash_t *self, free_fn_t *value_free_fn) {
    self->value_free_fn = value_free_fn;
}

void
hash_put_key_free_fn(hash_t *self, free_fn_t *key_free_fn) {
    self->key_free_fn = key_free_fn;
}

void
hash_put_key_equal_fn(hash_t *self, equal_fn_t *key_equal_fn) {
    self->key_equal_fn = key_equal_fn;
}

static void hash_delete_entry(hash_t *self, hash_entry_t *entry);

static void
hash_purge_without_shrink(hash_t *self) {
    size_t limit = hash_primes[self->prime_index];
    for (size_t index = 0; index < limit; index++) {
        // free all entries in this hash bucket.
        hash_entry_t *entry = self->entries[index];
        while (entry) {
            hash_entry_t *link = entry->link;
            hash_delete_entry(self, entry);
            entry = link;
        }

        self->entries[index] = NULL;
    }
}

void
hash_free(hash_t *self) {
    hash_purge_without_shrink(self);
    free(self->entries);
    free(self);
}

void
hash_purge(hash_t *self) {
    hash_purge_without_shrink(self);
    free(self->entries);
    hash_init(self);
}

size_t
hash_length(const hash_t *self) {
    return self->length;
}

static void
hash_rehash(hash_t *self, size_t new_prime_index) {
    assert(self);
    assert(new_prime_index < sizeof(hash_primes));

    size_t old_limit = hash_primes[self->prime_index];
    size_t new_limit = hash_primes[new_prime_index];
    hash_entry_t **new_entries = allocate_pointers(new_limit);

    // to debug performance:
    // {
    //     hash_report(self);
    // }

    self->prime_index = new_prime_index;
    self->used_indexes_size = 0;

    for (size_t index = 0; index < old_limit; index++) {
        hash_entry_t *entry = self->entries[index];
        while (entry) {
            hash_entry_t *link = entry->link;
            size_t new_index = hash_key_index(self, entry->key);
            entry->index = new_index;
            hash_entry_t *top_entry = new_entries[new_index];
            if (!top_entry)
                self->used_indexes_size++;

            entry->link = top_entry;
            new_entries[new_index] = entry;
            entry = link;
        }
    }

    free(self->entries);
    self->entries = new_entries;
}

static bool
hash_key_equal(hash_t *self, const void *key1, const void *key2) {
    if (!self->key_equal_fn)
        return key1 == key2;

    return self->key_equal_fn(key1, key2);
}

hash_entry_t *
hash_get_entry(hash_t *self, const void *key) {
    size_t index = hash_key_index(self, key);
    hash_entry_t *entry = self->entries[index];
    if (!entry) return NULL;

    while (entry) {
        if (hash_key_equal(self, entry->key, key))
            return entry;

        entry = entry->link;
    }

    return NULL;
}

bool
hash_has(hash_t *self, const void *key) {
    hash_entry_t *entry = hash_get_entry(self, key);
    return entry != NULL;
}

void *
hash_get(hash_t *self, const void *key) {
    hash_entry_t *entry = hash_get_entry(self, key);
    if (!entry) return NULL;

    return entry->value;
}

static void
hash_delete_entry(hash_t *self, hash_entry_t *entry) {
    // find previous entry since it's a singly-linked list.
    hash_entry_t **entry_pointer = &(self->entries[entry->index]);
    hash_entry_t *cursor_entry = self->entries[entry->index];
    while (cursor_entry) {
        if (cursor_entry == entry) break;
        entry_pointer = &(cursor_entry->link);
        cursor_entry = cursor_entry->link;
    }

    // entry must in the table.
    assert(cursor_entry);
    *entry_pointer = entry->link;
    self->length--;
    if (entry_pointer == &(self->entries[entry->index]))
        self->used_indexes_size--;

    if (self->key_free_fn)
        self->key_free_fn(entry->key);
    if (self->value_free_fn)
        self->value_free_fn(entry->value);

    // maintain insertion order.
    if (entry->prev && entry->next) {
        entry->prev->next = entry->next;
        entry->next->prev = entry->prev;
    } else if (entry->prev && !entry->next) {
        assert(self->last_entry == entry);
        entry->prev->next = NULL;
        self->last_entry = entry->prev;
    } else if (!entry->prev && entry->next) {
        assert(self->first_entry == entry);
        entry->next->prev = NULL;
        self->first_entry = entry->next;
    } else {
        assert(self->first_entry == entry);
        assert(self->last_entry == entry);
        self->first_entry = NULL;
        self->last_entry = NULL;
    }

    hash_entry_free(entry);
}

bool
hash_delete(hash_t *self, const void *key) {
    hash_entry_t *entry = hash_get_entry(self, key);
    if (!entry) return false;

    hash_delete_entry(self, entry);
    return true;
}

static bool
hash_is_overload(hash_t *self) {
    size_t limit = hash_primes[self->prime_index];
    return ((self->length >= limit * LENGTH_REHASH_PERCENTAGE / 100) ||
            (self->used_indexes_size >= limit * INDEX_REHASH_PERCENTAGE / 100));
}

static void
hash_order_push_entry(hash_t *self, hash_entry_t *entry) {
    if (self->last_entry) {
        self->last_entry->next = entry;
        entry->prev = self->last_entry;
        self->last_entry = entry;
    } else {
        assert(!self->first_entry);
        self->last_entry = entry;
        self->first_entry = entry;
    }
}

bool
hash_insert(hash_t *self, void *key, void *value) {
    if (hash_is_overload(self))
        hash_rehash(self, self->prime_index + 1);

    size_t index = hash_key_index(self, key);
    hash_entry_t *entry = self->entries[index];
    if (!entry) {
        hash_entry_t *new_entry = make_hash_entry(self, key, value);
        self->entries[index] = new_entry;
        self->used_indexes_size++;
        self->length++;
        hash_order_push_entry(self, new_entry);
        return true;
    }

    while (entry) {
        if (hash_key_equal(self, entry->key, key))
            return false;

        entry = entry->link;
    }

    hash_entry_t *new_entry = make_hash_entry(self, key, value);
    hash_entry_t *top_entry = self->entries[index];
    self->entries[index] = new_entry;
    new_entry->link = top_entry;
    self->length++;
    hash_order_push_entry(self, new_entry);
    return true;
}

void
hash_insert_or_fail(hash_t *self, void *key, void *value) {
    assert(hash_insert(self, key, value));
}

void
hash_put(hash_t *self, void *key, void *value) {
    hash_entry_t *entry = hash_get_entry(self, key);
    if (!entry) {
        assert(hash_insert(self, key, value));
        return;
    }

    if (self->key_free_fn)
        self->key_free_fn(entry->key);

    if (self->value_free_fn)
        self->value_free_fn(entry->value);

    entry->key = key;
    entry->value = value;
}

const hash_entry_t *
hash_first_entry(const hash_t *self) {
    return self->first_entry;
}

void
hash_report(const hash_t *self) {
    size_t limit = hash_primes[self->prime_index];
    size_t length_percentage = self->length * 100 / limit;
    size_t index_percentage = self->used_indexes_size * 100 / limit;

    printf("[hash_report] start: %p\n", (void *) self);
    printf("[hash_report] length percentage : %lu\n", length_percentage);
    printf("[hash_report] index  percentage : %lu\n", index_percentage);
    printf("[hash_report] prime index : %lu\n", self->prime_index);
    printf("[hash_report] prime       : %lu\n", limit);
    printf("[hash_report] used idx: %lu\n", self->used_indexes_size);
    printf("[hash_report] length  : %lu\n", self->length);

    size_t max_chain = 0;
    for (size_t i = 0; i < limit; i++) {
        hash_entry_t *entry = self->entries[i];
        size_t length = 0;
        while (entry) {
            entry = entry->link;
            length++;
        }

        max_chain = uint_max(length, max_chain);
    }

    printf("[hash_report] max_chain  : %lu\n", max_chain);
    printf("[hash_report] end\n");
}
