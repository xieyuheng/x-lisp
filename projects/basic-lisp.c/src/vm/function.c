#include "index.h"

function_t *
make_function(void) {
    function_t *self = new(function_t);
    self->binding_indexes = make_record();
    self->label_offsets = make_record();
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
    record_free(self->label_offsets);
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
    if (!function_has_binding(self, name)) {
        size_t next_index =
            record_length(self->binding_indexes);
        record_insert(self->binding_indexes, name, (void *) next_index);
    }
}

bool
function_has_binding(const function_t *self, const char *name) {
    return record_has(self->binding_indexes, name);
}

size_t
function_get_binding_index(const function_t *self, const char *name) {
    assert(function_has_binding(self, name));
    return (size_t) record_get(self->binding_indexes, name);
}

char *
function_get_binding_name_from_index(const function_t *self, size_t index) {
    record_iter_t iter;
    record_iter_init(&iter, self->binding_indexes);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        char *name = entry->key;
        if ((size_t) entry->value == index) {
            return name;
        }

        entry = record_iter_next_entry(&iter);
    }

    return NULL;
}

void
function_add_label(function_t *self, const char *name) {
    if (!function_has_label(self, name)) {
        record_insert(self->label_offsets, name, (void *) self->code_length);
    }
}

bool
function_has_label(const function_t *self, const char *name) {
    return record_has(self->label_offsets, name);
}

int32_t
function_get_label_offset(const function_t *self, const char *name) {
    assert(function_has_label(self, name));
    return (int64_t) record_get(self->label_offsets, name);
}

char *
function_get_label_name_from_offset(const function_t *self, int32_t offset) {
    record_iter_t iter;
    record_iter_init(&iter, self->label_offsets);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        char *name = entry->key;
        if ((int32_t) (int64_t) entry->value == offset) {
            return name;
        }

        entry = record_iter_next_entry(&iter);
    }

    return NULL;
}

void
function_add_label_reference(function_t *self, const char *name, int32_t offset) {
    if (!record_has(self->label_references, name)) {
        record_insert(self->label_references, name, make_list());
    }

    list_t *reference_list = record_get(self->label_references, name);
    list_push(reference_list, (void *) (int64_t) offset);
}

list_t *
function_get_label_reference_list(const function_t *self, const char *name) {
    return record_get(self->label_references, name);
}

void
function_patch_label_references(function_t *self) {
    record_iter_t iter;
    record_iter_init(&iter, self->label_references);
    const hash_entry_t *entry = record_iter_next_entry(&iter);
    while (entry) {
        char *name = entry->key;
        int32_t label_offset = function_get_label_offset(self, name);
        list_t *reference_list = entry->value;
        for (size_t i = 0; i < list_length(reference_list); i++) {
            int32_t code_offset = (int32_t) (int64_t) list_get(reference_list, i);
            assert(code_offset + sizeof(definition_t *) < self->code_area_size);
            uint8_t *code = self->code_area + code_offset;
            int32_t offset = label_offset - (code_offset + sizeof(int32_t));
            memory_store_little_endian(code, offset);
        }

        entry = record_iter_next_entry(&iter);
    }
}

static void function_inspect_instr(
    const function_t *function,
    uint8_t *pc,
    struct instr_t instr
) {
    switch (instr.op) {
    case OP_LITERAL: {
        string_print("literal ");
        print(instr.literal.value);
        return;
    }

    case OP_RETURN: {
        string_print("return");
        return;
    }

    case OP_CALL: {
        string_print("call ");
        string_print(instr.ref.definition->name);
        return;
    }

    case OP_TAIL_CALL: {
        string_print("tail-call ");
        string_print(instr.ref.definition->name);
        return;
    }

    case OP_REF: {
        string_print("ref ");
        string_print(instr.ref.definition->name);
        return;
    }

    case OP_APPLY: {
        string_print("apply");
        return;
    }

    case OP_TAIL_APPLY: {
        string_print("tail-apply");
        return;
    }

    case OP_ASSIGN_VARIABLE: {
        string_print("assign-variable");
        return;
    }

    case OP_LOCAL_LOAD: {
        string_print("local-load ");
        char *name = function_get_binding_name_from_index(function, instr.local.index);
        string_print(name);
        return;
    }

    case OP_LOCAL_STORE: {
        string_print("local-store ");
        char *name = function_get_binding_name_from_index(function, instr.local.index);
        string_print(name);
        return;
    }

    case OP_JUMP: {
        string_print("jump ");
        int32_t base = pc - function->code_area;
        char *name = function_get_label_name_from_offset(function, base + instr.jump.offset);
        string_print(name);
        return;
    }

    case OP_JUMP_IF_NOT: {
        string_print("jump-if-not ");
        int32_t base = pc - function->code_area;
        char *name = function_get_label_name_from_offset(function, base + instr.jump.offset);
        string_print(name);
        return;
    }

    case OP_DROP: {
        string_print("drop");
        return;
    }
    }

    unreachable();
}

void
function_inspect(const function_t *function) {
    uint8_t *pc = function->code_area;
    while (pc < function->code_area + function->code_length) {
        int32_t offset = pc - function->code_area;
        char *name = function_get_label_name_from_offset(function, offset);
        if (name) {
            string_print(name);
            string_print(":");
            newline();
        }

        struct instr_t instr = instr_decode(pc);
        pc += instr_length(instr);
        string_print("  ");
        function_inspect_instr(function, pc, instr);
        newline();
    }
}
