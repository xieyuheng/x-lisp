#include "index.h"

const object_class_t line_var_class = {
    .name = "line_var",
    .print_fn = (object_print_fn_t *) line_var_print,
    .hash_code_fn = (object_hash_code_fn_t *) line_var_hash_code,
    .compare_fn = (object_compare_fn_t *) line_var_compare,
};

static record_t *global_line_var_record = NULL;

line_var_t *
intern_line_var(const char *string) {
    if (!global_line_var_record) {
        global_line_var_record = make_record();
    }

    line_var_t *found = record_get(global_line_var_record, string);
    if (found) {
        return found;
    }

    line_var_t *self = new(line_var_t);
    self->header.class = &line_var_class;
    self->string = string_copy(string);
    record_insert_or_fail(global_line_var_record, string, self);
    return self;
}

void
line_var_free(line_var_t *self) {
    string_free(self->string);
    free(self);
}

const char *
line_var_string(const line_var_t *self) {
    return self->string;
}

size_t
line_var_length(const line_var_t *self) {
    return string_length(self->string);
}

bool
line_var_p(value_t value) {
    return object_p(value) &&
        to_object(value)->header.class == &line_var_class;
}

line_var_t *
to_line_var(value_t value) {
    assert(line_var_p(value));
    return (line_var_t *) to_object(value);
}

void
line_var_print(printer_t *printer, const line_var_t *self) {
    (void) printer;
    string_print(line_var_string(self));
}

hash_code_t
line_var_hash_code(const line_var_t *self) {
    return 3 * string_hash_code(self->string);
}

ordering_t
line_var_compare(const line_var_t *lhs, const line_var_t *rhs) {
    return string_compare_lexical(lhs->string, rhs->string);
}
