#include "index.h"

function_t *
make_function(void) {
    function_t *self = new(function_t);
    self->binding_indexes = make_record();
    self->label_indexes = make_record();
    self->label_references = make_record_with((free_fn_t *) list_free);
    self->parameters = NULL;
    self->code_area_size = 64;
    self->code_area = allocate(self->code_area_size);
    self->code_length = 0;
    return self;
}

void
function_free(function_t *self) {
    record_free(self->binding_indexes);
    record_free(self->label_indexes);
    record_free(self->label_references);
    if (self->parameters)
        array_free(self->parameters);
    free(self->code_area);
    free(self);
}

static void
function_maybe_grow_code_area(function_t *self, size_t length) {
    if (self->code_area_size <
        self->code_length + length) {
        self->code_area =
            reallocate(self->code_area,
                       self->code_area_size,
                       self->code_area_size * 2);
        self->code_area_size *= 2;
        function_maybe_grow_code_area(self, length);
    }
}

void
function_append_instr(function_t *self, struct instr_t instr) {
    size_t length = instr_length(instr);
    function_maybe_grow_code_area(self, length);

    uint8_t *code =
        self->code_area
        + self->code_length;
    instr_encode(code, instr);

    self->code_length += length;
}

void function_put_instr(
    function_t *self,
    size_t code_index,
    struct instr_t instr
) {
    size_t length = instr_length(instr);
    assert(code_index + length < self->code_area_size);

    uint8_t *code = self->code_area + code_index;
    instr_encode(code, instr);
}

void
function_put_definition(
    function_t *self,
    size_t code_index,
    definition_t *definition
) {
    assert(code_index + sizeof(definition_t *) < self->code_area_size);

    uint8_t *code = self->code_area + code_index;
    memory_store_little_endian(code, definition);
}

void
function_add_binding(function_t *self, const char *name) {
    if (!function_has_binding_index(self, name)) {
        size_t next_index =
            record_length(self->binding_indexes);
        record_insert(self->binding_indexes,
                      name,
                      (void *) next_index);
    }
}

bool
function_has_binding_index(function_t *self, const char *name) {
    return record_has(self->binding_indexes, name);
}

size_t
function_get_binding_index(function_t *self, const char *name) {
    assert(function_has_binding_index(self, name));
    return (size_t) record_get(self->binding_indexes, name);
}

void
function_add_label(function_t *self, const char *name) {
    if (!function_has_label_index(self, name)) {
        record_insert(self->label_indexes,
                      name,
                      (void *) self->code_length);
    }
}

bool
function_has_label_index(function_t *self, const char *name) {
    return record_has(self->label_indexes, name);
}

size_t
function_get_label_index(function_t *self, const char *name) {
    assert(function_has_label_index(self, name));
    return (size_t) record_get(self->label_indexes, name);
}
