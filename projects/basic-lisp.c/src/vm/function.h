#pragma once

struct function_t {
    record_t *binding_indexes; // record of size_t
    record_t *label_offsets; // record of int32_t
    record_t *label_references; // record of list of int32_t
    array_t *parameters; // optional array of char *
    uint8_t *code_area;
    size_t code_area_size;
    size_t code_length;
};

function_t *make_function(void);
void function_free(function_t *self);

void function_append_instr(function_t *self, struct instr_t instr);
void function_put_instr(function_t *self, size_t code_index, struct instr_t instr);
void function_put_definition(function_t *self, size_t code_index, definition_t *definition);

void function_add_binding(function_t *self, const char *name);
bool function_has_binding_index(function_t *self, const char *name);
size_t function_get_binding_index(function_t *self, const char *name);

void function_add_label(function_t *self, const char *name);
bool function_has_label(function_t *self, const char *name);
int32_t function_get_label_offset(function_t *self, const char *name);

void function_add_label_reference(function_t *self, const char *name, int32_t offset);
list_t *function_get_label_reference_list(function_t *self, const char *name);
void function_patch_label_references(function_t *self);

void function_print(const function_t *self);
