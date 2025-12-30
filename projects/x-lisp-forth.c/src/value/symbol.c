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
    self->header.class = &symbol_class;
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

bool
symbol_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &symbol_class;
}

symbol_t *
to_symbol(value_t value) {
    assert(symbol_p(value));
    return (symbol_t *) to_object(value);
}

void
symbol_print(const symbol_t *self) {
    string_print("'");
    string_print(symbol_string(self));
}

uint64_t
symbol_hash_code(const symbol_t *self) {
    return 3 * string_hash_code(self->string);
}

const object_class_t symbol_class = {
    .name = "symbol",
    .print_fn = (object_print_fn_t *) symbol_print,
    .hash_code_fn = (object_hash_code_fn_t *) symbol_hash_code,
};
