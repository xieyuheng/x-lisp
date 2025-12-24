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
