#include "index.h"

static record_t *global_symbol_record = NULL;

symbol_t *
intern_symbol(const char *string) {
    if (!global_symbol_record) {
        global_symbol_record = make_record();
    }

    symbol_t *found = record_get(global_symbol_record, string);
    if (found) {
        return found;
    }

    symbol_t *self = new(symbol_t);
    self->string = string_copy(string);
    record_insert_or_fail(global_symbol_record, string, self);
    return self;
}

void
symbol_free(symbol_t *self) {
    string_free(self->string);
    free(self);
}

const char *
symbol_string(const symbol_t *self) {
    return self->string;
}

size_t
symbol_length(const symbol_t *self) {
    return string_length(self->string);
}

inline value_t
x_symbol(symbol_t *target) {
    return (uint64_t) target | X_SYMBOL;
}

inline bool
symbol_p(value_t value) {
    return value_tag(value) == X_SYMBOL;
}

inline symbol_t *
to_symbol(value_t value) {
    assert(symbol_p(value));
    return (symbol_t *) (value & PAYLOAD_MASK);
}
